"""
LeadintelAI Enterprise Backend Verification Test Suite
Powered by ECC `test-automator` & `backend-architect` standards.
"""

import sys
import unittest
from fastapi.testclient import TestClient

import main
import models
from database import engine, SessionLocal

class TestLeadintelBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        models.Base.metadata.create_all(bind=engine)
        cls.client = TestClient(main.app)
        cls.test_email = "test.founder@nexusscale.in"
        cls.test_password = "SecureTestPass123!"

    def test_01_root_health(self):
        """Verify API Gateway root status and module discovery."""
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("modules", data)
        self.assertEqual(data["modules"]["datacloud_leads"], "ready")
        self.assertEqual(data["modules"]["pipeline_crm"], "ready")

    def test_02_register_and_auth_token(self):
        """Verify user registration and JWT token generation."""
        # Clean up existing test user if present
        db = SessionLocal()
        existing = db.query(models.User).filter(models.User.email == self.test_email).first()
        if existing:
            # Delete dependent records
            db.query(models.Transaction).filter(models.Transaction.user_id == existing.id).delete()
            db.query(models.UnlockedLead).filter(models.UnlockedLead.user_id == existing.id).delete()
            db.query(models.CRMDeal).filter(models.CRMDeal.user_id == existing.id).delete()
            db.delete(existing)
            db.commit()
        db.close()

        # Register
        reg_payload = {
            "email": self.test_email,
            "password": self.test_password,
            "first_name": "Test",
            "last_name": "Founder",
            "company_name": "Nexus Scale AI",
            "phone_number": "+919876543210"
        }
        res = self.client.post("/register", json=reg_payload)
        self.assertEqual(res.status_code, 201)
        user_data = res.json()
        self.assertEqual(user_data["email"], self.test_email)
        self.assertGreaterEqual(user_data["wallet_balance"], 100.0)

        # Token login
        login_res = self.client.post("/token", data={
            "username": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(login_res.status_code, 200)
        token_data = login_res.json()
        self.assertIn("access_token", token_data)
        TestLeadintelBackend.token = token_data["access_token"]
        TestLeadintelBackend.headers = {"Authorization": f"Bearer {TestLeadintelBackend.token}"}

    def test_03_users_me(self):
        """Verify protected /users/me endpoint returns authenticated profile."""
        res = self.client.get("/users/me", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["email"], self.test_email)

    def test_04_crm_deal_lifecycle(self):
        """Verify CRM deal creation, listing, stage update, and metrics computation."""
        deal_payload = {
            "title": "Enterprise DataCloud Annual License",
            "company": "Swiggy Outbound Team",
            "contact_name": "Rohan Mehta",
            "contact_email": "rohan.mehta@swiggy.com",
            "contact_phone": "+91 9811223344",
            "value": 180000.0,
            "stage": "new",
            "probability": 25,
            "notes": "Discussed 100k verified contact volume."
        }
        res = self.client.post("/crm/deals", json=deal_payload, headers=self.headers)
        self.assertEqual(res.status_code, 201)
        deal_id = res.json()["id"]
        self.assertEqual(res.json()["value"], 180000.0)

        # Update stage to WON
        patch_res = self.client.patch(f"/crm/deals/{deal_id}", json={"stage": "won", "probability": 100}, headers=self.headers)
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["stage"], "won")

        # Metrics
        metric_res = self.client.get("/crm/metrics", headers=self.headers)
        self.assertEqual(metric_res.status_code, 200)
        self.assertGreaterEqual(metric_res.json()["won_deals"], 1)

        # Verify paginated deals listing (Image 4 optimization)
        list_res = self.client.get("/crm/deals?page=1&page_size=20", headers=self.headers)
        self.assertEqual(list_res.status_code, 200)
        list_data = list_res.json()
        self.assertIn("items", list_data)
        self.assertIn("total", list_data)
        self.assertIn("has_more", list_data)
        self.assertGreaterEqual(list_data["total"], 1)

    def test_05_wallet_topup_and_ledger(self):
        """Verify wallet pack checkout, payment verification, and credit addition."""
        topup_res = self.client.post("/wallet/topup", json={
            "pack_id": "growth",
            "amount": 12999.0
        }, headers=self.headers)
        self.assertEqual(topup_res.status_code, 200)
        order_id = topup_res.json()["order_id"]

        # Verify payment
        verify_res = self.client.post("/wallet/verify-payment", json={
            "order_id": order_id,
            "payment_id": "pay_test_98a72b",
            "amount": 12999.0
        }, headers=self.headers)
        self.assertEqual(verify_res.status_code, 200)
        self.assertEqual(verify_res.json()["status"], "success")

        # History ledger
        hist_res = self.client.get("/wallet/history", headers=self.headers)
        self.assertEqual(hist_res.status_code, 200)
        self.assertGreaterEqual(len(hist_res.json()["items"]), 1)

    def test_06_maya_autonomous_terminal(self):
        """Verify Maya terminal sessions, plugins, and model router."""
        session_res = self.client.post("/api/chat/sessions", json={"title": "Q4 ICP Strategy"}, headers=self.headers)
        self.assertEqual(session_res.status_code, 200)
        self.assertIn("session_id", session_res.json())

        # Plugins
        plugins_res = self.client.get("/api/plugins")
        self.assertEqual(plugins_res.status_code, 200)
        self.assertGreaterEqual(len(plugins_res.json()), 4)

    def test_07_leads_search_unlock_export(self):
        """Verify B2B leads search with pagination, unlock, batch-unlock, and CSV export."""
        # Search leads with default 20 items pagination
        search_res = self.client.get("/leads/search?page_size=20", headers=self.headers)
        self.assertEqual(search_res.status_code, 200)
        data = search_res.json()
        self.assertEqual(len(data["items"]), 20)
        self.assertGreaterEqual(data["total"], 200)
        self.assertTrue(data["has_more"])

        first_lead_id = data["items"][0]["id"]
        second_lead_id = data["items"][1]["id"]

        # Single unlock
        unlock_res = self.client.post(f"/leads/{first_lead_id}/unlock", headers=self.headers)
        self.assertEqual(unlock_res.status_code, 200)
        self.assertIn("@", unlock_res.json()["email"])

        # Batch unlock
        batch_res = self.client.post("/leads/batch-unlock", json={
            "lead_ids": [first_lead_id, second_lead_id]
        }, headers=self.headers)
        self.assertEqual(batch_res.status_code, 200)
        self.assertEqual(batch_res.json()["unlocked_count"], 1) # Only second lead newly unlocked

        # List unlocked
        unlocked_res = self.client.get("/leads/unlocked", headers=self.headers)
        self.assertEqual(unlocked_res.status_code, 200)
        self.assertGreaterEqual(len(unlocked_res.json()["items"]), 2)

        # Export CSV
        export_res = self.client.get("/leads/export?export_format=csv", headers=self.headers)
        self.assertEqual(export_res.status_code, 200)
        self.assertIn("text/csv", export_res.headers["content-type"])
        self.assertIn("Verified Email", export_res.text)

    def test_08_team_rbac_employee_management(self):
        """Verify Super Admin can list roles, create employee accounts (Admin, Manager), and manage roster."""
        # Check roles matrix
        roles_res = self.client.get("/api/team/roles", headers=self.headers)
        self.assertEqual(roles_res.status_code, 200)
        roles_data = roles_res.json()
        self.assertIn("super_admin", roles_data)
        self.assertIn("admin", roles_data)
        self.assertIn("manager", roles_data)

        # Create Admin employee
        admin_email = "test.admin@nexusscale.in"
        db = SessionLocal()
        existing_admin = db.query(models.User).filter(models.User.email == admin_email).first()
        if existing_admin:
            db.delete(existing_admin)
            db.commit()
        db.close()

        create_admin_payload = {
            "first_name": "Priya",
            "last_name": "Sharma",
            "email": admin_email,
            "role": "admin",
            "department": "CXO Outbound Operations",
            "credit_quota": 10000.0,
            "password": "AdminPassword2026!"
        }
        res_admin = self.client.post("/api/team/members", json=create_admin_payload, headers=self.headers)
        self.assertEqual(res_admin.status_code, 201)
        created_admin = res_admin.json()
        self.assertEqual(created_admin["role"], "admin")
        self.assertEqual(created_admin["email"], admin_email)
        admin_id = created_admin["id"]

        # Create Manager employee
        manager_email = "test.manager@nexusscale.in"
        db = SessionLocal()
        existing_mgr = db.query(models.User).filter(models.User.email == manager_email).first()
        if existing_mgr:
            db.delete(existing_mgr)
            db.commit()
        db.close()

        create_mgr_payload = {
            "first_name": "Rohan",
            "last_name": "Mehta",
            "email": manager_email,
            "role": "manager",
            "department": "Sales Development",
            "credit_quota": 5000.0,
            "password": "ManagerPassword2026!"
        }
        res_mgr = self.client.post("/api/team/members", json=create_mgr_payload, headers=self.headers)
        self.assertEqual(res_mgr.status_code, 201)
        created_mgr = res_mgr.json()
        self.assertEqual(created_mgr["role"], "manager")

        # List members
        members_res = self.client.get("/api/team/members", headers=self.headers)
        self.assertEqual(members_res.status_code, 200)
        members = members_res.json()
        self.assertGreaterEqual(len(members), 2)
        member_roles = [m["role"] for m in members]
        self.assertIn("admin", member_roles)
        self.assertIn("manager", member_roles)

        # Update member (promote/change quota)
        patch_res = self.client.patch(f"/api/team/members/{admin_id}", json={
            "department": "Global Enterprise Expansion",
            "credit_quota": 15000.0
        }, headers=self.headers)
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["department"], "Global Enterprise Expansion")
        self.assertEqual(patch_res.json()["credit_quota"], 15000.0)

        # Deactivate member
        del_res = self.client.delete(f"/api/team/members/{admin_id}", headers=self.headers)
        self.assertEqual(del_res.status_code, 200)
        self.assertIn("revoked", del_res.json()["message"])

    def test_09_private_gateway_passkey_recovery(self):
        """Test private gateway passkey generation, verification, and 2-attempt email recovery trigger."""
        # 1. Get settings
        res = self.client.get("/api/maya/gateway-settings")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("passkey", data)
        self.assertIn("recovery_email", data)

        # 2. Generate new passkey from Maya settings
        gen_res = self.client.post("/api/maya/gateway/generate-passkey")
        self.assertEqual(gen_res.status_code, 200)
        new_key = gen_res.json()["passkey"]
        self.assertTrue(new_key.startswith("MAYA-"))

        # 3. Update recovery email in Maya settings
        patch_res = self.client.post("/api/maya/gateway-settings", json={
            "recovery_email": "gaurav@leadintel.ai",
            "reset_attempts": True
        })
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["config"]["recovery_email"], "gaurav@leadintel.ai")

        # 4. Attempt 1 with invalid passkey
        v1 = self.client.post("/api/maya/gateway/verify-passkey", json={"passkey": "wrong_key_1"})
        self.assertEqual(v1.status_code, 200)
        self.assertFalse(v1.json()["valid"])
        self.assertEqual(v1.json()["attempts"], 1)
        self.assertFalse(v1.json()["recovery_triggered"])

        # 5. Attempt 2 with invalid passkey -> MUST trigger recovery email
        v2 = self.client.post("/api/maya/gateway/verify-passkey", json={"passkey": "wrong_key_2"})
        self.assertEqual(v2.status_code, 200)
        self.assertFalse(v2.json()["valid"])
        self.assertEqual(v2.json()["attempts"], 2)
        self.assertTrue(v2.json()["recovery_triggered"])

        # 6. Verify with the correct generated passkey -> Success & reset
        v3 = self.client.post("/api/maya/gateway/verify-passkey", json={"passkey": new_key})
        self.assertEqual(v3.status_code, 200)
        self.assertTrue(v3.json()["valid"])
        self.assertEqual(v3.json()["attempts"], 0)

if __name__ == "__main__":
    unittest.main()
