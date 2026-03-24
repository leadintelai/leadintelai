from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
import random
import string
import os
from datetime import datetime, timedelta, timezone
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

from dotenv import load_dotenv
load_dotenv() 

import models, schemas, auth, ai_service
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LeadintelAI API",
    description="Full Backend API for LeadintelAI with Database and Wallet Support",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- EMAIL CONFIGURATION ---
conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "placeholder@gmail.com"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "password_placeholder"),
    MAIL_FROM = os.getenv("MAIL_FROM", "leadintelai@gmail.com"),
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_FROM_NAME = "LeadintelAI",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)
fm = FastMail(conf)

# --- AUTH ENDPOINTS ---

@app.post("/auth/send-otp")
async def send_otp(request: schemas.OTPSend, db: Session = Depends(get_db)):
    identifier = request.identifier.lower()
    otp_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    expiry = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    db_otp = models.EmailOTP(
        identifier=identifier,
        otp_code=otp_code,
        expires_at=expiry
    )
    db.add(db_otp)
    db.commit()
    
    # Logic to distinguish between email and phone
    if "@" not in identifier:
        raise HTTPException(status_code=400, detail="Only email verification is supported.")

    # Send Email OTP
    print(f"DEBUG: Sending Email OTP {otp_code} to {identifier}")
    try:
        message = MessageSchema(
            subject="Your LeadintelAI Verification Code",
            recipients=[identifier],
            body=f"Your OTP code is: {otp_code}. Valid for 10 minutes.",
            subtype="html"
        )
        fm = FastMail(conf)
        await fm.send_message(message)
    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send OTP email: {str(e)}")
    
    return {"message": f"OTP sent successfully to {identifier}"}

@app.post("/auth/verify-otp")
async def verify_otp(request: schemas.OTPVerify, db: Session = Depends(get_db)):
    identifier = request.identifier.lower()
    print(f"DEBUG: Verifying OTP {request.otp_code} for {identifier}")
    
    db_otp = db.query(models.EmailOTP).filter(
        models.EmailOTP.identifier == identifier,
        models.EmailOTP.otp_code == request.otp_code
    ).order_by(models.EmailOTP.created_at.desc()).first()
    
    if not db_otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    # Ensure timing matches
    now = datetime.now(timezone.utc)
    # Handle both offset-aware and naive datetime comparison
    otp_expiry = db_otp.expires_at
    if otp_expiry.tzinfo is None:
        otp_expiry = otp_expiry.replace(tzinfo=timezone.utc)
        
    if otp_expiry < now:
        raise HTTPException(status_code=400, detail="OTP code has expired")
    
    # NEW: Mark as verified so /register can trust it
    db_otp.is_verified = True
    db.commit()
    
    return {"message": "OTP verified successfully"}

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username.lower()).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login-otp", response_model=schemas.Token)
async def login_with_otp(request: schemas.OTPVerify, db: Session = Depends(get_db)):
    email_lower = request.email.lower()
    user = db.query(models.User).filter(models.User.email == email_lower).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found with this email.")
        
    db_otp = db.query(models.EmailOTP).filter(
        models.EmailOTP.email == email_lower,
        models.EmailOTP.otp_code == request.otp_code
    ).order_by(models.EmailOTP.created_at.desc()).first()
    
    if not db_otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
        
    now = datetime.now(timezone.utc)
    otp_expiry = db_otp.expires_at
    if otp_expiry.tzinfo is None:
        otp_expiry = otp_expiry.replace(tzinfo=timezone.utc)
        
    if otp_expiry < now:
        raise HTTPException(status_code=400, detail="OTP code has expired")
        
    # Mark as used/delete
    db.delete(db_otp)
    db.commit()
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/reset-password")
async def reset_password(request: schemas.PasswordReset, db: Session = Depends(get_db)):
    email_lower = request.email.lower()
    user = db.query(models.User).filter(models.User.email == email_lower).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    recent_otp = db.query(models.EmailOTP).filter(
        models.EmailOTP.email == email_lower,
        models.EmailOTP.is_verified == True
    ).order_by(models.EmailOTP.created_at.desc()).first()
    
    if not recent_otp:
        raise HTTPException(status_code=400, detail="Email not verified. Please verify an OTP first.")
        
    # Delete the verification record after use
    db.delete(recent_otp)
    
    hashed_password = auth.get_password_hash(request.new_password)
    user.hashed_password = hashed_password
    db.commit()
    
    return {"message": "Password updated successfully"}

@app.post("/register", response_model=schemas.User)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Check if email is verified
    email_otp = db.query(models.EmailOTP).filter(
        models.EmailOTP.identifier == user.email.lower(),
        models.EmailOTP.is_verified == True
    ).order_by(models.EmailOTP.created_at.desc()).first()

    if not email_otp:
        raise HTTPException(status_code=400, detail="Email must be verified with OTP first.")
    
    # 2. Cleanup verification records
    db.delete(email_otp)
    
    db_user = db.query(models.User).filter(models.User.email == user.email.lower()).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email.lower(),
        first_name=user.first_name,
        last_name=user.last_name,
        company_name=user.company_name,
        phone_number=user.phone_number,
        hashed_password=hashed_password,
        wallet_balance=100.0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- LEAD ENDPOINTS ---

@app.get("/leads/search", response_model=List[schemas.LeadDisplay])
async def search_leads(
    industry: Optional[str] = None,
    location: Optional[str] = None,
    job_title: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Lead)
    if industry:
        query = query.filter(models.Lead.industry.contains(industry))
    if location:
        query = query.filter(models.Lead.location.contains(location))
    if job_title:
        query = query.filter(models.Lead.job_title.contains(job_title))
    
    return query.limit(50).all()

@app.post("/leads/{lead_id}/unlock", response_model=schemas.LeadDetail)
async def unlock_lead(
    lead_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Check if already unlocked
    existing = db.query(models.UnlockedLead).filter(
        models.UnlockedLead.user_id == current_user.id,
        models.UnlockedLead.lead_id == lead_id
    ).first()
    
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if existing:
        return lead

    # Check balance
    if current_user.wallet_balance < lead.price_to_unlock:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")

    # Deduct funds
    current_user.wallet_balance -= lead.price_to_unlock
    
    # Create transaction record
    transaction = models.Transaction(
        user_id=current_user.id,
        amount=-lead.price_to_unlock,
        type="debit",
        description=f"Unlocked lead: {lead.name} at {lead.company}"
    )
    
    # Record unlock
    unlocked = models.UnlockedLead(user_id=current_user.id, lead_id=lead_id)
    
    db.add(transaction)
    db.add(unlocked)
    db.commit()
    
    return lead

# --- WALLET & CAMPAIGN ENDPOINTS ---

@app.get("/wallet/history", response_model=List[schemas.TransactionDisplay])
async def get_wallet_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Transaction).filter(models.Transaction.user_id == current_user.id).all()

@app.get("/campaigns", response_model=List[schemas.CampaignDisplay])
async def get_campaigns(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.WhatsAppCampaign).filter(models.WhatsAppCampaign.user_id == current_user.id).all()

# --- AI ENDPOINTS ---

@app.post("/ai/chat", response_model=schemas.ChatResponse)
async def ai_chat(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db)
):
    # Public chatbot doesn't require current_user
    # We use a default high-quality personality for the landing page
    system_prompt = "You are a friendly, expert sales assistant for LeadintelAI. You help users understand our products and guide them towards lead generation success. Be helpful, professional, and slightly enthusiastic."
    agent_name = "LeadintelAI Assistant"
    tone = "friendly"
    
    # Generate the reply
    reply = await ai_service.generate_chat_response(request.message, system_prompt, agent_name, tone)
    
    # NEW: Check if reply is a JSON signal for registration
    if reply.startswith('{"action": "register_interest"'):
        import json
        try:
            signal = json.loads(reply)
            data = signal["data"]
            
            # Save to database (null user_id for public chat)
            db_lead = models.ChatLead(
                user_id=None,
                full_name=data["full_name"],
                email=data["email"],
                interest_area=data["interest_area"],
                notes=data.get("notes")
            )
            db.add(db_lead)
            db.commit()
            
            # Use the AI's friendly reply instead of the raw JSON
            reply = signal["reply"]
        except Exception as e:
            print(f"Error handling AI tool call: {e}")
            reply = "I've noted your interest, but had a slight issue saving your details. Please try again or contact support."

    # Log usage (only if tokens or user tracking is needed)
    # For public chat we skip logging to a specific user
    # log = models.AILog(user_id=None, endpoint="/ai/chat", cost=0.005)
    # db.add(log)
    # db.commit()
    
    return {"reply": reply}

@app.get("/ai/chat-leads", response_model=List[schemas.ChatLeadDisplay])
async def get_chat_leads(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve leads collected by the AI chatbot for the current user."""
    return db.query(models.ChatLead).filter(models.ChatLead.user_id == current_user.id).all()

@app.post("/ai/generate-campaign", response_model=schemas.CampaignGenResponse)
async def ai_generate_campaign(
    request: schemas.CampaignGenRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    templates = await ai_service.generate_campaign_content(
        request.product_name, request.target_audience, request.key_benefits, request.tone
    )
    
    log = models.AILog(
        user_id=current_user.id,
        endpoint="/ai/generate-campaign",
        cost=0.01
    )
    db.add(log)
    db.commit()
    
    return {"templates": templates}

@app.post("/ai/score-lead", response_model=schemas.LeadScoreResponse)
async def ai_score_lead(
    request: schemas.LeadScoreRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    result = await ai_service.score_lead(request.industry, request.job_title, request.company)
    
    log = models.AILog(
        user_id=current_user.id,
        endpoint="/ai/score-lead",
        cost=0.005
    )
    db.add(log)
    db.commit()
    
    return result

@app.post("/ai/chatbot-config", response_model=schemas.AIChatbotConfigDisplay)
async def create_chatbot_config(
    config: schemas.AIChatbotConfigCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_config = models.AIChatbotConfig(
        user_id=current_user.id,
        **config.model_dump()
    )
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@app.get("/")
async def root():
    return {"status": "online", "message": "LeadintelAI Enterprise API", "version": "2.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=False)
