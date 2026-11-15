"""
LeadintelAI Enterprise Backend API
Powered by ECC Architectural Standards:
- Clean modular routers (Auth, Leads, CRM, Campaigns, Wallet, Maya Terminal, AI)
- Production-grade CORS & Security
- OpenAPI / Swagger documentation
"""

import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

import models
from database import engine
from routers import auth, leads, crm, wallet, campaigns, maya, ai, team

# Initialize database schema and performance indexes
models.Base.metadata.create_all(bind=engine)

def ensure_schema_migrations():
    from sqlalchemy import text
    with engine.connect() as conn:
        for col_name, col_type in [
            ('role', 'VARCHAR DEFAULT "super_admin"'),
            ('department', 'VARCHAR DEFAULT "Executive Leadership"'),
            ('credit_quota', 'FLOAT DEFAULT 0.0'),
            ('created_by_id', 'INTEGER')
        ]:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                conn.commit()
            except Exception:
                pass

ensure_schema_migrations()

app = FastAPI(
    title="LeadintelAI Enterprise API",
    description="Full Modular Backend API powering DataCloud B2B Leads, Pipeline CRM, WhatsApp Automation, and Maya Autonomous AI Co-pilot.",
    version="2.5.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
allowed_origins = [
    "https://leadintelai.in",
    "https://www.leadintelai.in",
    "https://leadintel-production.up.railway.app",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.leadintelai\.in|https://.*\.vercel\.app|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Modular Routers
app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(crm.router)
app.include_router(wallet.router)
app.include_router(campaigns.router)
app.include_router(maya.router)
app.include_router(ai.router)
app.include_router(team.router)

@app.get("/", tags=["Health & Status"])
@app.get("/health", tags=["Health & Status"])
async def root():
    return {
        "status": "online",
        "service": "LeadintelAI Enterprise API",
        "version": "2.5.0",
        "modules": {
            "auth": "ready",
            "team_rbac": "ready",
            "datacloud_leads": "ready",
            "pipeline_crm": "ready",
            "wallet_billing": "ready",
            "outreach_campaigns": "ready",
            "maya_autonomous_terminal": "ready",
            "aria_sdr": "ready"
        },
        "documentation": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=False)
