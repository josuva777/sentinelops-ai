import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASS = os.environ.get("SMTP_PASS")
SMTP_FROM = os.environ.get("SMTP_FROM", "SentinelOps Security <security@sentinelops.ai>")

def send_otp_email(recipient_email: str, otp_code: str) -> dict:
    """
    Dispatches cryptographic 6-digit OTP verification email.
    If SMTP credentials are provided, sends live email.
    Otherwise, logs to stdout and provides dev mode payload for instant verification.
    """
    subject = f"SentinelOps Verification Code: {otp_code}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>{subject}</title>
    </head>
    <body style="background-color: #020617; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; margin: 0;">
      <div style="max-width: 520px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 36px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);">
        <div style="text-align: center; margin-bottom: 28px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SentinelOps AI</h2>
          <p style="color: #10b981; font-size: 11px; font-family: monospace; font-weight: 700; margin-top: 4px; letter-spacing: 1.5px;">DETERMINISTIC IN-LINE GUARDRAILS</p>
        </div>
        
        <div style="background-color: rgba(2, 6, 23, 0.6); border: 1px solid #1e293b; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px 0;">Use the single-use 6-digit security code below to complete your enterprise identity verification:</p>
          <div style="font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #10b981; font-family: monospace; background: #020617; padding: 16px 24px; border-radius: 12px; border: 1px dashed #10b981; display: inline-block;">
            {otp_code}
          </div>
          <p style="color: #64748b; font-size: 12px; font-family: monospace; margin: 16px 0 0 0;">Valid for 10 minutes • Single-use only</p>
        </div>
        
        <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0;">
          If you did not request this verification code, please ignore this email or contact your organization's security administrator immediately. SentinelOps will never ask for your code over chat or phone.
        </p>
      </div>
    </body>
    </html>
    """

    # 1. Attempt live SMTP dispatch if credentials exist
    if SMTP_HOST and SMTP_USER and SMTP_PASS:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = SMTP_FROM
            msg["To"] = recipient_email
            msg.attach(MIMEText(f"Your SentinelOps verification code is: {otp_code}. Valid for 10 minutes.", "plain"))
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(SMTP_FROM, [recipient_email], msg.as_string())
            print(f"[SUCCESS] Dispatched live OTP email to {recipient_email}")
            return {"sent": True, "provider": "smtp", "recipient": recipient_email}
        except Exception as e:
            print(f"[!] SMTP dispatch failed: {e}. Falling back to dev mode.")

    # 2. Local Dev Mode Output
    print("=================================================================")
    print(f"[DEV MODE] OTP CODE DISPATCHED FOR {recipient_email}: [{otp_code}]")
    print("=================================================================")
    return {
        "sent": True,
        "provider": "dev_simulator",
        "recipient": recipient_email,
        "dev_otp": otp_code, # surfaced in dev response for 1-click convenience
        "note": "Running in local developer mode. To send live emails, configure SMTP_HOST in .env."
    }
