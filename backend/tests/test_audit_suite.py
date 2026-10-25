import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models import (
    OTPSendRequest,
    OTPVerifyRequest,
    OTPFinalizeRequest,
    LoginRequest,
)
from app.main import (
    send_otp,
    verify_otp,
    finalize_otp_registration,
    login,
    verify_audit_ledger,
)
from app.billing import (
    CreateCheckoutSessionRequest,
    VerifySessionRequest,
    create_checkout_session,
    verify_session,
)
from app.engine import engine

def run_tests():
    print("=================================================================")
    print("[*] STARTING SENTINELOPS ENTERPRISE SECURITY & BILLING AUDIT SUITE")
    print("=================================================================")

    # 1. TEST EMAIL OTP DISPATCH
    import secrets
    from app.db import generate_email_otp
    test_email = f"lead_{secrets.token_hex(4)}@acme-corp.com"
    print(f"\n[1] Testing Email OTP Dispatch to: {test_email}...")
    otp_code, expires_at = generate_email_otp(test_email)
    otp_res = send_otp(OTPSendRequest(email=test_email))
    # Reset to our test code in DB so verify matches
    from app.db import hash_password, get_db
    h, s = hash_password(otp_code)
    conn = get_db()
    conn.execute("UPDATE email_otps SET otp_hash = ?, salt = ? WHERE email = ?", (h, s, test_email))
    conn.commit()
    conn.close()

    assert otp_res.success is True, "OTP send failed"
    assert len(otp_code) == 6, "OTP must be 6 digits"
    print(f"    [+] Cryptographic OTP Generated & Dispatched: {otp_code} (Valid for 10m)")

    # 2. TEST OTP VERIFICATION (Wrong code rejected)
    print("\n[2] Testing OTP Verification with wrong code...")
    wrong_res = verify_otp(OTPVerifyRequest(email=test_email, code="000000"))
    assert wrong_res.success is False, "Wrong OTP was erroneously accepted"
    print("    [+] Correctly rejected invalid OTP code.")

    # 3. TEST OTP VERIFICATION (Correct code)
    print("\n[3] Testing OTP Verification with correct code...")
    correct_res = verify_otp(OTPVerifyRequest(email=test_email, code=otp_code))
    assert correct_res.success is True, "Correct OTP verification failed"
    assert correct_res.is_new_user is True, "Should identify as new user"
    print("    [+] OTP Confirmed! Email ownership verified.")

    # 4. TEST ACCOUNT FINALIZATION (Set custom password & company)
    print("\n[4] Finalizing tenant account with custom password & company...")
    final_res = finalize_otp_registration(OTPFinalizeRequest(
        email=test_email,
        password="SecureEnterprisePass#2026",
        name="Sarah Connor",
        company="Acme Defense Systems"
    ))
    assert final_res.success is True, "Account finalization failed"
    token = final_res.token
    user = final_res.user
    user_id = user.id
    assert user.tier == "FREE", "Initial tier must be FREE"
    assert user.tool_calls_limit == 50000, "Initial quota must be 50,000"
    print(f"    [+] Tenant Created: {user.name} ({user.company})")
    print(f"    [+] Initial Tier: {user.tier} (Quota: {user.tool_calls_limit:,} calls)")

    # 5. TEST STRIPE CHECKOUT SESSION INITIATION
    print("\n[5] Testing Stripe Checkout Session Initiation (SecOps Team - Annual)...")
    checkout_res = create_checkout_session(CreateCheckoutSessionRequest(
        tier="TEAM",
        billing_cycle="annual",
        user_id=user_id,
        email=test_email
    ))
    session_id = checkout_res["session_id"]
    assert session_id is not None, "Checkout session ID missing"
    print(f"    [+] Stripe Checkout Session ID: {session_id}")
    print(f"    [+] Amount: {checkout_res['amount_formatted']} | Quota Target: {checkout_res['quota']:,}")

    # 6. TEST PAYMENT CONFIRMATION, TIER UPGRADE & QUOTA EXPANSION
    print("\n[6] Verifying Payment Settlement & Executing Automated Provisioning...")
    verify_res = verify_session(VerifySessionRequest(
        session_id=session_id,
        user_id=user_id
    ))
    assert verify_res["success"] is True, "Billing verification failed"
    upgraded_user = verify_res["user"]
    txn = verify_res["transaction"]
    assert upgraded_user["tier"] == "TEAM", "Tier was not upgraded to TEAM"
    assert upgraded_user["tool_calls_limit"] == 1000000, "Quota was not expanded to 1,000,000"
    print(f"    [+] SUCCESS: Upgraded to {upgraded_user['tier']} Tier!")
    print(f"    [+] Quota Expanded: {upgraded_user['tool_calls_limit']:,} monthly calls (from 50,000)")
    print(f"    [+] Cryptographic Receipt: {txn['id']}")
    print(f"    [+] SHA-256 Ledger Hash: {txn['sha256_hash']}")

    # 7. VERIFY AUDIT LEDGER INTEGRITY
    print("\n[7] Verifying Tamper-Evident SHA-256 Audit Ledger...")
    audit_verify = verify_audit_ledger()
    assert audit_verify["integrity_verified"] is True, "Audit ledger integrity compromised"
    print(f"    [+] All {audit_verify['blocks_verified']} blocks cryptographically verified unbroken!")

    # 8. VERIFY MASTER ADMIN EXCLUSIVITY
    print("\n[8] Verifying Master Admin Exclusivity & Tenant Role Boundaries...")
    # New user Sarah Connor must NOT have is_master_admin
    assert user.is_master_admin is False, "Security violation: Non-admin elevated to master"
    
    # Master admin Josuva login check
    master_login = login(LoginRequest(
        email="josuva732006@gmail.com",
        password="josuva/12345"
    ))
    assert master_login.success is True, "Master admin login failed"
    assert master_login.user.is_master_admin is True, "Master admin flag missing"
    print(f"    [+] Master Admin Verified: {master_login.user.email} (Supreme Super Admin)")

    print("\n=================================================================")
    print("[SUCCESS] 100% OF SECURITY, OTP, BILLING & AUDIT TESTS PASSED!")
    print("=================================================================\n")

if __name__ == "__main__":
    run_tests()

