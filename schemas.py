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
    identifier: Optional[str] = None
    email: Optional[str] = None
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
    role: Optional[str] = "super_admin"
    department: Optional[str] = "Executive Leadership"
    credit_quota: Optional[float] = 0.0

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    credit_quota: Optional[float] = None

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    role: str = "manager" # super_admin, admin, manager
    department: Optional[str] = "CXO Outbound"
    credit_quota: Optional[float] = 5000.0
    password: Optional[str] = "Leadintel2026!"

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    credit_quota: Optional[float] = None
    is_active: Optional[bool] = None

class EmployeeOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str] = None
    role: str
    department: Optional[str] = None
    credit_quota: Optional[float] = 0.0
    wallet_balance: float
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

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
    is_unlocked: bool = False

    class Config:
        from_attributes = True

class LeadDetail(LeadDisplay):
    email: str
    phone: str

class BatchUnlockRequest(BaseModel):
    lead_ids: List[int]

class BatchUnlockResponse(BaseModel):
    unlocked_count: int
    total_cost: float
    remaining_balance: float
    leads: List[LeadDetail]

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

class PublicChatRequest(BaseModel):
    message: str
    history: list = []

# --- PAGINATED API RESPONSE WRAPPERS ---
class PaginatedLeadsResponse(BaseModel):
    items: List[LeadDisplay]
    page: Optional[int] = 1
    page_size: int = 20
    total: int
    has_more: bool
    next_page: Optional[int] = None
    next_cursor: Optional[int] = None

class PaginatedUnlockedLeadsResponse(BaseModel):
    items: List[LeadDetail]
    page: Optional[int] = 1
    page_size: int = 20
    total: int
    has_more: bool
    next_page: Optional[int] = None
    next_cursor: Optional[int] = None

class PaginatedTransactionsResponse(BaseModel):
    items: List[TransactionDisplay]
    page: Optional[int] = 1
    page_size: int = 20
    total: Optional[int] = None
    has_more: bool
    next_page: Optional[int] = None
    next_cursor: Optional[int] = None

class PaginatedCampaignsResponse(BaseModel):
    items: List[CampaignDisplay]
    page: int = 1
    page_size: int = 20
    total: int
    has_more: bool
    next_page: Optional[int] = None

class PaginatedChatLeadsResponse(BaseModel):
    items: List[ChatLeadDisplay]
    page: Optional[int] = 1
    page_size: int = 20
    total: int
    has_more: bool
    next_page: Optional[int] = None
    next_cursor: Optional[int] = None

# --- CRM SCHEMAS ---
class CRMDealBase(BaseModel):
    title: str
    company: str
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    value: float = 0.0
    stage: str = "new"
    probability: int = 20
    notes: Optional[str] = None

class CRMDealCreate(CRMDealBase):
    pass

class CRMDealUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    value: Optional[float] = None
    stage: Optional[str] = None
    probability: Optional[int] = None
    notes: Optional[str] = None

class CRMDealDisplay(CRMDealBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaginatedDealsResponse(BaseModel):
    items: List[CRMDealDisplay]
    page: Optional[int] = 1
    page_size: int = 20
    total: int
    has_more: bool
    next_page: Optional[int] = None
    next_cursor: Optional[int] = None

class CRMMetricsResponse(BaseModel):
    total_pipeline_value: float
    total_deals: int
    won_deals: int
    won_value: float
    conversion_rate: float
    stage_breakdown: dict

# --- WALLET TOPUP SCHEMAS ---
class WalletTopUpRequest(BaseModel):
    pack_id: str
    amount: float
    currency: str = "INR"

class WalletTopUpResponse(BaseModel):
    order_id: str
    amount: float
    currency: str
    credits: float
    status: str

class WalletVerifyPaymentRequest(BaseModel):
    order_id: str
    payment_id: str
    amount: float

# --- MAYA AGENT SCHEMAS ---
class MayaSessionCreate(BaseModel):
    title: Optional[str] = "New Autonomous Session"
    model_name: Optional[str] = "auto"

class MayaSessionDisplay(BaseModel):
    session_id: str
    title: str
    model_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class MayaChatSendRequest(BaseModel):
    session_id: str
    message: str
    model_override: Optional[str] = None
