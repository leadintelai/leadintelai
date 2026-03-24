from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- AUTH SCHEMAS ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class OTPSend(BaseModel):
    identifier: str # email or phone_number

class OTPVerify(BaseModel):
    identifier: str
    otp_code: str

class PasswordReset(BaseModel):
    email: EmailStr
    new_password: str

class GoogleToken(BaseModel):
    id_token: str

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    company_name: str
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: Optional[int] = None # Added Optional and default for safety during migration
    wallet_balance: float
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- LEAD SCHEMAS ---
class LeadBase(BaseModel):
    name: str
    job_title: str
    company: str
    industry: str
    location: str

class LeadDisplay(LeadBase):
    id: int
    price_to_unlock: float

    class Config:
        from_attributes = True

class LeadDetail(LeadDisplay):
    email: str
    phone: str

# --- BILLING SCHEMAS ---
class TransactionDisplay(BaseModel):
    amount: float
    type: str
    description: str
    timestamp: datetime

    class Config:
        from_attributes = True

# --- CAMPAIGN SCHEMAS ---
class CampaignBase(BaseModel):
    name: str
    status: str

class CampaignDisplay(CampaignBase):
    id: int
    sent_count: int
    read_count: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI SCHEMAS ---
class ChatRequest(BaseModel):
    message: str
    phone_number: str

class ChatResponse(BaseModel):
    reply: str
    status: str = "success"

class CampaignGenRequest(BaseModel):
    product_name: str
    target_audience: str
    key_benefits: str
    tone: Optional[str] = "professional"

class CampaignGenResponse(BaseModel):
    templates: List[str]

class LeadScoreRequest(BaseModel):
    industry: str
    job_title: str
    company: str

class LeadScoreResponse(BaseModel):
    score: int # 1-100
    summary: str
    recommendations: List[str]

class AIChatbotConfigBase(BaseModel):
    phone_number: str
    system_prompt: str
    agent_name: str
    tone: str
    is_active: bool = True

class AIChatbotConfigCreate(AIChatbotConfigBase):
    pass

class AIChatbotConfigDisplay(AIChatbotConfigBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- CHAT LEAD SCHEMAS ---
class ChatLeadBase(BaseModel):
    full_name: str
    email: str
    interest_area: str
    notes: Optional[str] = None

class ChatLeadCreate(ChatLeadBase):
    user_id: int

class ChatLeadDisplay(ChatLeadBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
