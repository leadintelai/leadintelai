from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    company_name = Column(String)
    phone_number = Column(String, unique=True, index=True)
    hashed_password = Column(String) 
    wallet_balance = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    transactions = relationship("Transaction", back_populates="owner")
    unlocked_leads = relationship("UnlockedLead", back_populates="user")
    campaigns = relationship("WhatsAppCampaign", back_populates="owner")
    chatbot_configs = relationship("AIChatbotConfig", back_populates="owner")
    ai_logs = relationship("AILog", back_populates="user")
    chat_leads = relationship("ChatLead", back_populates="owner")

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    job_title = Column(String)
    company = Column(String)
    industry = Column(String)
    location = Column(String)
    email = Column(String)
    phone = Column(String)
    price_to_unlock = Column(Float, default=15.0)

class UnlockedLead(Base):
    __tablename__ = "unlocked_leads"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lead_id = Column(Integer, ForeignKey("leads.id"))
    unlocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="unlocked_leads")
    lead = relationship("Lead")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    type = Column(String) # 'credit' or 'debit'
    description = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="transactions")

class WhatsAppCampaign(Base):
    __tablename__ = "whatsapp_campaigns"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    status = Column(String) # 'active', 'paused', 'draft'
    sent_count = Column(Integer, default=0)
    read_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="campaigns")

class AIChatbotConfig(Base):
    __tablename__ = "ai_chatbot_configs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    phone_number = Column(String, index=True) # WhatsApp number associated
    system_prompt = Column(String, default="You are a helpful assistant.")
    agent_name = Column(String, default="LeadintelAI Assistant")
    tone = Column(String, default="professional")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="chatbot_configs")

class AILog(Base):
    __tablename__ = "ai_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    endpoint = Column(String) # '/ai/chat', '/ai/score-lead', etc.
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    cost = Column(Float, default=0.0) # Estimated cost in USD or credits
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="ai_logs")

class EmailOTP(Base):
    __tablename__ = "email_otps"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, index=True) # email or phone_number
    otp_code = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime)
    is_verified = Column(Boolean, default=False)

class ChatLead(Base):
    __tablename__ = "chat_leads"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) # Which user's bot collected this
    full_name = Column(String)
    email = Column(String)
    interest_area = Column(String) # B2B Data, API, Mailing, etc.
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="chat_leads")
