import enum
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Index, UniqueConstraint
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class CampaignStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"

class DealStage(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    DEMO = "demo"
    PROPOSAL = "proposal"
    WON = "won"
    LOST = "lost"

class TransactionType(str, enum.Enum):
    CREDIT = "credit"
    DEBIT = "debit"

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"

class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        Index('idx_users_email_active', 'email', 'is_active'),
    )

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    company_name = Column(String)
    phone_number = Column(String, unique=True, index=True)
    hashed_password = Column(String) 
    wallet_balance = Column(Float, default=0.0)
    role = Column(String, default="super_admin")
    department = Column(String, default="Executive Leadership")
    credit_quota = Column(Float, default=0.0)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    transactions = relationship("Transaction", back_populates="owner", lazy="selectin")
    unlocked_leads = relationship("UnlockedLead", back_populates="user", lazy="selectin")
    campaigns = relationship("WhatsAppCampaign", back_populates="owner", lazy="selectin")
    chatbot_configs = relationship("AIChatbotConfig", back_populates="owner", lazy="selectin")
    ai_logs = relationship("AILog", back_populates="user", lazy="selectin")
    chat_leads = relationship("ChatLead", back_populates="owner", lazy="selectin")
    deals = relationship("CRMDeal", back_populates="owner", lazy="selectin")

class Lead(Base):
    __tablename__ = "leads"
    __table_args__ = (
        Index('idx_leads_industry_location', 'industry', 'location'),
        Index('idx_leads_company_industry', 'company', 'industry'),
        Index('idx_leads_email', 'email'),
        Index('idx_leads_phone', 'phone'),
        Index('idx_leads_name', 'name'),
    )

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    job_title = Column(String, index=True)
    company = Column(String, index=True)
    industry = Column(String, index=True)
    location = Column(String, index=True)
    email = Column(String)
    phone = Column(String)
    price_to_unlock = Column(Float, default=15.0)

class UnlockedLead(Base):
    __tablename__ = "unlocked_leads"
    __table_args__ = (
        UniqueConstraint('user_id', 'lead_id', name='uq_unlocked_lead_user_lead'),
        Index('idx_unlocked_leads_user_lead', 'user_id', 'lead_id'),
        Index('idx_unlocked_leads_user_unlocked_at', 'user_id', 'unlocked_at'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), index=True)
    unlocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="unlocked_leads")
    lead = relationship("Lead", lazy="joined")

class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = (
        Index('idx_transactions_user_timestamp', 'user_id', 'timestamp'),
        Index('idx_transactions_user_type_time', 'user_id', 'type', 'timestamp'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    amount = Column(Float)
    type = Column(SQLEnum(TransactionType, values_callable=lambda obj: [e.value for e in obj]), default=TransactionType.DEBIT)
    description = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="transactions")

class WhatsAppCampaign(Base):
    __tablename__ = "whatsapp_campaigns"
    __table_args__ = (
        Index('idx_campaigns_user_status', 'user_id', 'status'),
        Index('idx_campaigns_user_created', 'user_id', 'created_at'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    name = Column(String)
    status = Column(SQLEnum(CampaignStatus, values_callable=lambda obj: [e.value for e in obj]), default=CampaignStatus.DRAFT, index=True)
    sent_count = Column(Integer, default=0)
    read_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="campaigns")

class AIChatbotConfig(Base):
    __tablename__ = "ai_chatbot_configs"
    __table_args__ = (
        Index('idx_chatbot_configs_user_active', 'user_id', 'is_active'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    phone_number = Column(String, index=True) # WhatsApp number associated
    system_prompt = Column(String, default="You are a helpful assistant.")
    agent_name = Column(String, default="LeadintelAI Assistant")
    tone = Column(String, default="professional")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="chatbot_configs")

class AILog(Base):
    __tablename__ = "ai_logs"
    __table_args__ = (
        Index('idx_ai_logs_user_timestamp', 'user_id', 'timestamp'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    endpoint = Column(String) # '/ai/chat', '/ai/score-lead', etc.
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    cost = Column(Float, default=0.0) # Estimated cost in USD or credits
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="ai_logs")

class EmailOTP(Base):
    __tablename__ = "email_otps"
    __table_args__ = (
        Index('idx_email_otps_identifier_created', 'identifier', 'created_at'),
        Index('idx_email_otps_identifier_verified', 'identifier', 'is_verified', 'created_at'),
    )

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, index=True) # email or phone_number
    otp_code = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    expires_at = Column(DateTime)
    is_verified = Column(Boolean, default=False, index=True)
    attempts_count = Column(Integer, default=0)
    is_locked = Column(Boolean, default=False)

class ChatLead(Base):
    __tablename__ = "chat_leads"
    __table_args__ = (
        Index('idx_chat_leads_user_created', 'user_id', 'created_at'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True) # Which user's bot collected this
    full_name = Column(String)
    email = Column(String, index=True)
    interest_area = Column(String) # B2B Data, API, Mailing, etc.
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="chat_leads")

class CRMDeal(Base):
    __tablename__ = "crm_deals"
    __table_args__ = (
        Index('idx_crm_deals_user_stage', 'user_id', 'stage'),
        Index('idx_crm_deals_user_updated', 'user_id', 'updated_at'),
        Index('idx_crm_deals_user_created', 'user_id', 'created_at'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, nullable=False)
    company = Column(String, index=True)
    contact_name = Column(String)
    contact_email = Column(String)
    contact_phone = Column(String)
    value = Column(Float, default=0.0) # Estimated deal value in INR
    stage = Column(SQLEnum(DealStage, values_callable=lambda obj: [e.value for e in obj]), default=DealStage.NEW, index=True)
    probability = Column(Integer, default=20) # 0-100%
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="deals")

class MayaSession(Base):
    __tablename__ = "maya_sessions"

    id = Column(String, primary_key=True, index=True) # UUID session_id
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String, default="New Autonomous Session")
    model_name = Column(String, default="auto")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    messages = relationship("MayaMessage", back_populates="session", cascade="all, delete-orphan", lazy="selectin")

class MayaMessage(Base):
    __tablename__ = "maya_messages"
    __table_args__ = (
        Index('idx_maya_messages_session_created', 'session_id', 'created_at'),
    )

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("maya_sessions.id"), index=True)
    sender = Column(String) # 'user' or agent_id ('maya', 'aria', 'scout', etc.)
    content = Column(String)
    response_type = Column(String, default="text") # 'text', 'card', 'table'
    data_json = Column(String, nullable=True) # Serialized JSON payload
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("MayaSession", back_populates="messages")
