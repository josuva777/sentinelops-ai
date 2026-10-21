import sqlite3
import os
import hashlib
import secrets
from typing import Optional, List, Dict, Any
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "sentinelops.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
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
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (email.strip(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_all_users() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users ORDER BY is_master_admin DESC, created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_user(name: str, email: str, password: str, company: str, role: str = "DEVELOPER", tier: str = "FREE") -> Dict[str, Any]:
    # Security Rule: Only Master Admin can create or promote to SUPER_ADMIN
    if role == "SUPER_ADMIN":
        role = "DEVELOPER"

    conn = get_db()
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
    conn.close()
    return get_user_by_id(user_id)

def create_session(user_id: str, ip_address: str = "127.0.0.1", device: str = "Desktop Web") -> str:
    conn = get_db()
    cursor = conn.cursor()
    token = f"sn_sess_{secrets.token_hex(24)}"
    now = datetime.utcnow().isoformat()
    cursor.execute("""
    INSERT INTO sessions (token, user_id, created_at, ip_address, device, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
    """, (token, user_id, now, ip_address, device))
    conn.commit()
    conn.close()
    return token

def get_user_by_token(token: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.* FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.token = ? AND s.is_active = 1
    """, (token,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def update_user_role(user_id: str, new_role: str, requesting_user: Dict[str, Any]) -> bool:
    # Strict Master Admin Guard: Only Master Admin (josuva732006@gmail.com) can promote anyone to SUPER_ADMIN!
    if requesting_user.get("email", "").lower() != "josuva732006@gmail.com" and not requesting_user.get("is_master_admin"):
        raise PermissionError("Only the Master Super Admin (josuva732006@gmail.com) can grant administrative privileges.")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET role = ? WHERE id = ?", (new_role, user_id))
    conn.commit()
    conn.close()
    return True

def set_user_suspension(user_id: str, suspend: bool, requesting_user: Dict[str, Any]) -> bool:
    target = get_user_by_id(user_id)
    if not target:
        return False
    # Never allow suspending the Master Admin
    if target.get("is_master_admin"):
        raise PermissionError("The Supreme Master Admin cannot be suspended.")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET is_suspended = ? WHERE id = ?", (1 if suspend else 0, user_id))
    conn.commit()
    conn.close()
    return True
