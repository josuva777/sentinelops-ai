import sqlite3
import os
import hashlib
import secrets
from typing import Optional, List, Dict, Any
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "sentinelops.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=30.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=30000")
    return conn

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return hashed, salt

def verify_password(password: str, password_hash: str, salt: str) -> bool:
    hashed, _ = hash_password(password, salt)
    return hashed == password_hash

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        tier TEXT NOT NULL,
        tool_calls_used INTEGER DEFAULT 0,
        tool_calls_limit INTEGER DEFAULT 50000,
        is_suspended INTEGER DEFAULT 0,
        is_master_admin INTEGER DEFAULT 0,
        ip_address TEXT,
        device TEXT,
        created_at TEXT NOT NULL,
        last_active TEXT NOT NULL
    )
    """)

    # 2. Sessions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        ip_address TEXT,
        device TEXT,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    # 3. Email OTPs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS email_otps (
        email TEXT PRIMARY KEY,
        otp_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        attempts INTEGER DEFAULT 0,
        is_verified INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    # 4. Billing Transactions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS billing_transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        tier TEXT NOT NULL,
        billing_cycle TEXT NOT NULL,
        amount_cents INTEGER NOT NULL,
        currency TEXT NOT NULL,
        stripe_session_id TEXT UNIQUE,
        stripe_payment_intent TEXT,
        status TEXT NOT NULL,
        sha256_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    conn.commit()

    # Pre-seed Master Admin: josuva732006@gmail.com / josuva/12345
    master_email = "josuva732006@gmail.com"
    cursor.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (master_email,))
    existing_master = cursor.fetchone()

    master_hash, master_salt = hash_password("josuva/12345")
    if not existing_master:
        cursor.execute("""
        INSERT INTO users (
            id, name, email, password_hash, salt, company, role, tier,
            tool_calls_used, tool_calls_limit, is_suspended, is_master_admin,
            ip_address, device, created_at, last_active
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        """, (
            "usr_master_josuva",
            "Josuva (Supreme Master Admin)",
            master_email,
            master_hash,
            master_salt,
            "SentinelOps Global Command",
            "SUPER_ADMIN",
            "ENTERPRISE",
            12450,
            10000000,
            0,
            1, # is_master_admin = 1
            "127.0.0.1 (Localhost / Hardware Key Bound)",
            "Master Workstation Console",
            datetime.utcnow().isoformat(),
            "Active now"
        ))
    else:
        # Update credentials to ensure exact password and master role
        cursor.execute("""
        UPDATE users SET
            password_hash = ?,
            salt = ?,
            role = 'SUPER_ADMIN',
            tier = 'ENTERPRISE',
            is_master_admin = 1,
            tool_calls_limit = 10000000
        WHERE LOWER(email) = LOWER(?)
        """, (master_hash, master_salt, master_email))

    # Pre-seed secondary demo developer: devon@autonomous-agents.dev
    dev_email = "devon@autonomous-agents.dev"
    cursor.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (dev_email,))
    if not cursor.fetchone():
        dev_hash, dev_salt = hash_password("devon123")
        cursor.execute("""
        INSERT INTO users (
            id, name, email, password_hash, salt, company, role, tier,
            tool_calls_used, tool_calls_limit, is_suspended, is_master_admin,
            ip_address, device, created_at, last_active
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        """, (
            "usr_dev_02",
            "Devon Vance",
            dev_email,
            dev_hash,
            dev_salt,
            "AgentCraft Labs",
            "DEVELOPER",
            "FREE",
            49850,
            50000,
            0,
            0,
            "203.0.113.19 (EU-West)",
            "MacOS Safari Desktop",
            datetime.utcnow().isoformat(),
            "Active 10 mins ago"
        ))

    conn.commit()
    conn.close()

# Initialize DB on module import
init_db()

# Query helper functions
def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (email.strip(),))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def get_all_users() -> List[Dict[str, Any]]:
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users ORDER BY is_master_admin DESC, created_at DESC")
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

def create_user(name: str, email: str, password: str, company: str, role: str = "DEVELOPER", tier: str = "FREE") -> Dict[str, Any]:
    # Security Rule: Only Master Admin can create or promote to SUPER_ADMIN
    if role == "SUPER_ADMIN":
        role = "DEVELOPER"

    conn = get_db()
    try:
        cursor = conn.cursor()
        user_id = f"usr_{secrets.token_hex(6)}"
        p_hash, salt = hash_password(password)
        now = datetime.utcnow().isoformat()

        cursor.execute("""
        INSERT INTO users (
            id, name, email, password_hash, salt, company, role, tier,
            tool_calls_used, tool_calls_limit, is_suspended, is_master_admin,
            ip_address, device, created_at, last_active
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        """, (
            user_id, name, email.strip().lower(), p_hash, salt, company, role, tier,
            0, 50000 if tier == "FREE" else 1000000, 0, 0,
            "127.0.0.1 (Localhost)", "Desktop Web Client", now, "Active now"
        ))
        conn.commit()
        return get_user_by_id(user_id)
    finally:
        conn.close()

def create_session(user_id: str, ip_address: str = "127.0.0.1", device: str = "Desktop Web") -> str:
    conn = get_db()
    try:
        cursor = conn.cursor()
        token = f"sn_sess_{secrets.token_hex(24)}"
        now = datetime.utcnow().isoformat()
        cursor.execute("""
        INSERT INTO sessions (token, user_id, created_at, ip_address, device, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
        """, (token, user_id, now, ip_address, device))
        conn.commit()
        return token
    finally:
        conn.close()

def get_user_by_token(token: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT u.* FROM users u
        JOIN sessions s ON u.id = s.user_id
        WHERE s.token = ? AND s.is_active = 1
        """, (token,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def update_user_role(user_id: str, new_role: str, requesting_user: Dict[str, Any]) -> bool:
    # Strict Master Admin Guard: Only Master Admin (josuva732006@gmail.com) can promote anyone to SUPER_ADMIN!
    if requesting_user.get("email", "").lower() != "josuva732006@gmail.com" and not requesting_user.get("is_master_admin"):
        raise PermissionError("Only the Master Super Admin (josuva732006@gmail.com) can grant administrative privileges.")

    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET role = ? WHERE id = ?", (new_role, user_id))
        conn.commit()
        return True
    finally:
        conn.close()

def set_user_suspension(user_id: str, suspend: bool, requesting_user: Dict[str, Any]) -> bool:
    target = get_user_by_id(user_id)
    if not target:
        return False
    # Never allow suspending the Master Admin
    if target.get("is_master_admin"):
        raise PermissionError("The Supreme Master Admin cannot be suspended.")

    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET is_suspended = ? WHERE id = ?", (1 if suspend else 0, user_id))
        conn.commit()
        return True
    finally:
        conn.close()

# =========================================================================
# EMAIL OTP VERIFICATION HELPERS
# =========================================================================
from datetime import timedelta

def generate_email_otp(email: str) -> tuple[str, str]:
    email = email.strip().lower()
    # Cryptographically secure, unique 6-digit random code for all users (100,000 to 999,999)
    raw_otp = f"{secrets.randbelow(900000) + 100000}"

    otp_hash, salt = hash_password(raw_otp)
    now = datetime.utcnow()
    expires_at = (now + timedelta(minutes=10)).isoformat()
    created_at = now.isoformat()

    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO email_otps (email, otp_hash, salt, expires_at, attempts, is_verified, created_at)
        VALUES (?, ?, ?, ?, 0, 0, ?)
        ON CONFLICT(email) DO UPDATE SET
            otp_hash = excluded.otp_hash,
            salt = excluded.salt,
            expires_at = excluded.expires_at,
            attempts = 0,
            is_verified = 0,
            created_at = excluded.created_at
        """, (email, otp_hash, salt, expires_at, created_at))
        conn.commit()
        return raw_otp, expires_at
    finally:
        conn.close()

def verify_email_otp(email: str, entered_otp: str) -> tuple[bool, str, Optional[Dict[str, Any]]]:
    email = email.strip().lower()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM email_otps WHERE email = ?", (email,))
        row = cursor.fetchone()

        if not row:
            return False, "No OTP request found for this email. Please request a new code.", None

        otp_record = dict(row)
        now = datetime.utcnow()
        expires_at = datetime.fromisoformat(otp_record["expires_at"])

        if now > expires_at:
            return False, "This OTP has expired. Please request a new 6-digit verification code.", None

        if otp_record["attempts"] >= 5:
            return False, "Too many failed attempts. Security lock engaged. Please request a new OTP.", None

        is_valid = verify_password(entered_otp.strip(), otp_record["otp_hash"], otp_record["salt"])
        
        # Also support Master OTP for josuva732006@gmail.com
        if not is_valid and email == "josuva732006@gmail.com" and entered_otp.strip() == "732006":
            is_valid = True

        if not is_valid:
            cursor.execute("UPDATE email_otps SET attempts = attempts + 1 WHERE email = ?", (email,))
            conn.commit()
            return False, "Invalid OTP code. Please check your email and try again.", None

        # Mark as verified
        cursor.execute("UPDATE email_otps SET is_verified = 1 WHERE email = ?", (email,))
        conn.commit()

        # Check if user already exists
        user = get_user_by_email(email)
        return True, "Verification successful.", user
    finally:
        conn.close()

def complete_otp_registration(email: str, password: str, name: str, company: str) -> Dict[str, Any]:
    email = email.strip().lower()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT is_verified FROM email_otps WHERE email = ?", (email,))
        row = cursor.fetchone()
        if not row or not row["is_verified"]:
            raise ValueError("Email has not been verified via OTP yet.")

        # Check if user exists
        user = get_user_by_email(email)
        if user:
            # Update user's password and profile
            p_hash, salt = hash_password(password)
            cursor.execute("""
            UPDATE users SET password_hash = ?, salt = ?, name = ?, company = ?, last_active = ?
            WHERE email = ?
            """, (p_hash, salt, name, company, datetime.utcnow().isoformat(), email))
            conn.commit()
            return get_user_by_email(email)
        else:
            return create_user(name=name, email=email, password=password, company=company, role="DEVELOPER", tier="FREE")
    finally:
        conn.close()

def create_or_get_oauth_user(email: str, name: str, company: str, provider: str = "Google") -> Dict[str, Any]:
    email = email.strip().lower()
    existing = get_user_by_email(email)
    if existing:
        return existing
    # Random secure initial password for OAuth account
    dummy_pass = secrets.token_urlsafe(32)
    user = create_user(
        name=name or email.split("@")[0].title(),
        email=email,
        password=dummy_pass,
        company=company or f"{name}'s Team",
        role="DEVELOPER",
        tier="FREE"
    )
    return user

# =========================================================================
# STRIPE BILLING & FINANCIAL AUDIT LEDGER HELPERS
# =========================================================================
def record_billing_transaction(
    user_id: str,
    tier: str,
    billing_cycle: str,
    amount_cents: int,
    currency: str = "USD",
    stripe_session_id: Optional[str] = None,
    stripe_payment_intent: Optional[str] = None,
    status: str = "SUCCEEDED"
) -> Dict[str, Any]:
    conn = get_db()
    try:
        cursor = conn.cursor()
        # Check if transaction with this session_id already exists to prevent UNIQUE constraint crash
        if stripe_session_id:
            cursor.execute("SELECT * FROM billing_transactions WHERE stripe_session_id = ?", (stripe_session_id,))
            existing = cursor.fetchone()
            if existing:
                return dict(existing)

        txn_id = f"txn_{secrets.token_hex(10)}"
        now = datetime.utcnow().isoformat()
        
        # Compute tamper-evident cryptographic SHA-256 receipt hash
        raw_payload = f"{txn_id}|{user_id}|{tier}|{billing_cycle}|{amount_cents}|{currency}|{stripe_session_id}|{now}"
        sha256_hash = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest().upper()

        cursor.execute("""
        INSERT INTO billing_transactions (
            id, user_id, tier, billing_cycle, amount_cents, currency,
            stripe_session_id, stripe_payment_intent, status, sha256_hash, created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        """, (
            txn_id, user_id, tier, billing_cycle, amount_cents, currency,
            stripe_session_id or f"cs_sim_{secrets.token_hex(12)}",
            stripe_payment_intent or f"pi_sim_{secrets.token_hex(12)}",
            status, sha256_hash, now
        ))
        conn.commit()

        return {
            "id": txn_id,
            "user_id": user_id,
            "tier": tier,
            "billing_cycle": billing_cycle,
            "amount_cents": amount_cents,
            "amount_formatted": f"${amount_cents / 100:.2f} {currency.upper()}",
            "currency": currency,
            "stripe_session_id": stripe_session_id,
            "status": status,
            "sha256_hash": sha256_hash,
            "created_at": now
        }
    finally:
        conn.close()

def upgrade_user_subscription(user_id: str, tier: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    try:
        cursor = conn.cursor()
        # Tier quotas: FREE = 50k, TEAM = 1,000,000, ENTERPRISE = 10,000,000
        quota_limit = 1000000 if tier.upper() == "TEAM" else 10000000 if tier.upper() == "ENTERPRISE" else 50000

        cursor.execute("""
        UPDATE users SET tier = ?, tool_calls_limit = ?, last_active = ?
        WHERE id = ?
        """, (tier.upper(), quota_limit, datetime.utcnow().isoformat(), user_id))
        conn.commit()
        return get_user_by_id(user_id)
    finally:
        conn.close()

def get_user_billing_history(user_id: str) -> List[Dict[str, Any]]:
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT * FROM billing_transactions WHERE user_id = ? ORDER BY created_at DESC
        """, (user_id,))
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


