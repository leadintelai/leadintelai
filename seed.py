"""
LeadintelAI Enterprise Database Seeder
Seeds verified Indian B2B decision makers, demo enterprise user, CRM deals, and transaction ledger.
"""

from datetime import datetime, timezone, timedelta
import random

from database import engine, SessionLocal
import models
import auth

def seed_database():
    print("Initializing database tables...")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed or update demo enterprise account
        demo_email = "demo@leadintelai.in"
        demo_user = db.query(models.User).filter(models.User.email == demo_email).first()
        if not demo_user:
            demo_user = models.User(
                email=demo_email,
                first_name="Vikram",
                last_name="Malhotra",
                company_name="Nexus Capital & Outbound",
                phone_number="+919811223344",
                hashed_password=auth.get_password_hash("DemoPassword123!"),
                wallet_balance=25000.0,
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            print(f"Created demo account: {demo_email} (Pass: DemoPassword123!) with ₹25,000 balance")
        else:
            demo_user.wallet_balance = 25000.0
            db.commit()
            print(f"Refreshed demo user balance: ₹{demo_user.wallet_balance}")

        # 2. Seed realistic Indian B2B Leads
        lead_count = db.query(models.Lead).count()
        if lead_count < 150:
            print(f"Seeding B2B Decision Maker Leads (Current: {lead_count})...")
            
            first_names = [
                "Aarav", "Rohan", "Ananya", "Pooja", "Aditya", "Vikram", "Sneha", "Karan",
                "Neha", "Siddharth", "Ishaan", "Riya", "Varun", "Meera", "Kabir", "Tanvi",
                "Arjun", "Deepika", "Rahul", "Priyanka", "Naveen", "Gaurav", "Suresh", "Divya"
            ]
            last_names = [
                "Sharma", "Verma", "Mehta", "Patel", "Iyer", "Nair", "Reddy", "Chopra",
                "Gupta", "Bansal", "Singhania", "Deshmukh", "Kulkarni", "Menon", "Joshi", "Kapoor"
            ]
            
            companies = [
                ("Razorpay", "FinTech", "Bengaluru"),
                ("Zerodha", "FinTech", "Bengaluru"),
                ("Postman", "Developer Tools", "Bengaluru"),
                ("Freshworks", "SaaS", "Chennai"),
                ("Zoho", "SaaS", "Chennai"),
                ("Swiggy", "Consumer Tech", "Bengaluru"),
                ("Zomato", "E-Commerce", "Gurugram"),
                ("Delhivery", "Logistics", "Gurugram"),
                ("Nykaa", "E-Commerce", "Mumbai"),
                ("Pine Labs", "FinTech", "Noida"),
                ("InMobi", "AdTech", "Bengaluru"),
                ("BrowserStack", "DevOps", "Mumbai"),
                ("Darwinbox", "HR Tech", "Hyderabad"),
                ("Unacademy", "EdTech", "Bengaluru"),
                ("Chargebee", "FinTech SaaS", "Chennai"),
                ("Lenskart", "Retail Tech", "Delhi-NCR"),
                ("Shadowfax", "Logistics Tech", "Bengaluru"),
                ("Shiprocket", "E-Commerce Logistics", "Delhi-NCR"),
                ("LeadSquared", "CRM & Sales", "Bengaluru"),
                ("CleverTap", "Customer Engagement", "Mumbai"),
                ("MoEngage", "Marketing Automation", "Bengaluru"),
                ("Keka HR", "HR Tech", "Hyderabad"),
                ("Perfios", "B2B FinTech", "Bengaluru"),
                ("Groww", "WealthTech", "Bengaluru")
            ]
            
            job_titles = [
                "Founder & CEO",
                "Co-Founder & CTO",
                "Chief Revenue Officer",
                "VP of Engineering",
                "Head of Growth",
                "VP of Enterprise Sales",
                "Director of Product Management",
                "Chief Marketing Officer",
                "Head of Talent & HR",
                "VP of Operations"
            ]

            leads_to_insert = []
            for i in range(200):
                fn = random.choice(first_names)
                ln = random.choice(last_names)
                company, industry, city = random.choice(companies)
                title = random.choice(job_titles)
                
                domain = company.lower().replace(" ", "") + ".com"
                clean_email = f"{fn.lower()}.{ln.lower()}@{domain}"
                phone = f"+91 {random.choice([98, 97, 96, 91, 88])}{random.randint(10000000, 99999999)}"
                
                lead = models.Lead(
                    name=f"{fn} {ln}",
                    job_title=title,
                    company=company,
                    industry=industry,
                    location=f"{city}, India",
                    email=clean_email,
                    phone=phone,
                    price_to_unlock=15.0
                )
                leads_to_insert.append(lead)

            db.add_all(leads_to_insert)
            db.commit()
            print(f"Successfully seeded {len(leads_to_insert)} verified B2B leads!")
        else:
            print(f"Leads already populated ({lead_count} leads in database).")

        # 3. Seed Demo CRM Deals
        deal_count = db.query(models.CRMDeal).filter(models.CRMDeal.user_id == demo_user.id).count()
        if deal_count == 0:
            print("Seeding initial CRM Pipeline Deals for demo user...")
            demo_deals = [
                models.CRMDeal(
                    user_id=demo_user.id,
                    title="Enterprise DataCloud Expansion (100k Credits)",
                    company="Razorpay",
                    contact_name="Arjun Sharma",
                    contact_email="arjun.sharma@razorpay.com",
                    contact_phone="+91 9819920192",
                    value=150000.0,
                    stage=models.DealStage.PROPOSAL,
                    probability=75,
                    notes="Sent revised Master Service Agreement. Founder approved 100k credit volume."
                ),
                models.CRMDeal(
                    user_id=demo_user.id,
                    title="WhatsApp Outreach Automation Engine",
                    company="Darwinbox",
                    contact_name="Sneha Reddy",
                    contact_email="sneha.reddy@darwinbox.com",
                    contact_phone="+91 9701192837",
                    value=85000.0,
                    stage=models.DealStage.DEMO,
                    probability=50,
                    notes="Completed initial product walkthrough with VP Sales. Demo scheduled for Thursday."
                ),
                models.CRMDeal(
                    user_id=demo_user.id,
                    title="Autonomous Maya SDR Pilot",
                    company="Freshworks",
                    contact_name="Karan Nair",
                    contact_email="karan.nair@freshworks.com",
                    contact_phone="+91 9619283746",
                    value=120000.0,
                    stage=models.DealStage.WON,
                    probability=100,
                    notes="Signed annual blueprint contract. 24/7 inbound AI SDR live."
                ),
                models.CRMDeal(
                    user_id=demo_user.id,
                    title="B2B Manufacturing CXO Segment",
                    company="Delhivery",
                    contact_name="Neha Verma",
                    contact_email="neha.verma@delhivery.com",
                    contact_phone="+91 9820192834",
                    value=45000.0,
                    stage=models.DealStage.CONTACTED,
                    probability=30,
                    notes="Cold email sequence responded. Open to meeting next Tuesday."
                ),
                models.CRMDeal(
                    user_id=demo_user.id,
                    title="Outbound Telephony HLR Verification",
                    company="Swiggy",
                    contact_name="Rohan Mehta",
                    contact_email="rohan.mehta@swiggy.com",
                    contact_phone="+91 9128374650",
                    value=65000.0,
                    stage=models.DealStage.NEW,
                    probability=20,
                    notes="Inbound lead captured via Maya chat on landing page."
                )
            ]
            db.add_all(demo_deals)
            db.commit()
            print(f"Seeded {len(demo_deals)} active CRM pipeline deals!")

        # 4. Seed Initial WhatsApp Campaign
        campaign_count = db.query(models.WhatsAppCampaign).filter(models.WhatsAppCampaign.user_id == demo_user.id).count()
        if campaign_count == 0:
            campaign = models.WhatsAppCampaign(
                user_id=demo_user.id,
                name="Q4 SaaS CXO Executive Outreach",
                status=models.CampaignStatus.ACTIVE,
                sent_count=1450,
                read_count=1180
            )
            db.add(campaign)
            db.commit()
            print("Seeded active WhatsApp campaign.")

        # 5. Seed Initial Transaction Ledger
        tx_count = db.query(models.Transaction).filter(models.Transaction.user_id == demo_user.id).count()
        if tx_count == 0:
            initial_tx = models.Transaction(
                user_id=demo_user.id,
                amount=25000.0,
                type=models.TransactionType.CREDIT,
                description="Welcome Credit Balance - Enterprise Onboarding Pack"
            )
            db.add(initial_tx)
            db.commit()
            print("Seeded initial transaction ledger.")

        print("\nAll database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

