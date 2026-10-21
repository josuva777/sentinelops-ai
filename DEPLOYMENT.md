# SentinelOps AI — Production Deployment Guide

Deploying the complete SentinelOps AI platform (Next.js Web Console, FastAPI Deterministic Enforcement Gateway, and Mobile Companion) to modern cloud infrastructure.

---

## 🚀 Option 1: Fast Vercel Deployment (Frontend Web Console)

The web console is built on Next.js 15 and is 100% native to Vercel:

1. **Link GitHub Repository**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your repository: `josuva777/sentinelops-ai`.
2. **Configure Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `web` (Important: Click "Edit" and choose `web`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
3. **Environment Variables**:
   Add the following variables in the Vercel dashboard:
   ```env
   NEXT_PUBLIC_GATEWAY_URL=https://your-backend-gateway.onrender.com
   NEXT_PUBLIC_ENVIRONMENT=production
   ```
4. **Deploy**:
   Click **Deploy**. Your production URL (e.g., `https://sentinelops-ai.vercel.app`) will be live with full SSL, global CDN edge caching, and 100% uptime.

---

## ⚡ Option 2: Backend Enforcement Gateway Deployment

The backend is a high-performance Python FastAPI service with in-memory / SQLite SHA-256 audit ledgers and sub-8ms in-line tool evaluation.

### Deploy to Render / Railway (Recommended for Persistent In-Line Execution)
1. In Render ([render.com](https://render.com)) or Railway ([railway.app](https://railway.app)):
   - Create a **New Web Service** from GitHub repo `josuva777/sentinelops-ai`.
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3.10+`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Set Environment Variables:
   ```env
   PYTHONPATH=.
   SENTINELOPS_MODE=ENFORCE
   SENTINELOPS_FAIL_CLOSED=true
   ```
3. Copy the generated service URL (e.g., `https://sentinelops-backend.onrender.com`) and paste it as `NEXT_PUBLIC_GATEWAY_URL` in your Vercel project settings.

---

## 📱 Option 3: Mobile Companion (Android APK)

The mobile application is pre-configured with native Android source code:
- **Build APK**: Run `.\mobile\build_apk.bat` locally.
- **Output**: The compiled `.apk` is automatically moved to `releases/` and `web/public/downloads/sentinelops-mobile.apk`.
- **Distribution**: Users can download the APK directly from the website or open `mobile/android` in Android Studio to run on physical devices or emulators.

