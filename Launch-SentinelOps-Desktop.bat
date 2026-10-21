@echo off
title SentinelOps AI - Desktop App Launcher
echo ==========================================================
echo   SentinelOps AI Enterprise Desktop Launcher
echo ==========================================================

:: 1. Verify / start FastAPI backend if not running
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Starting SentinelOps Backend Gateway...
    cd /d "D:\sentinelops-ai\backend"
    start /min "SentinelOps Backend" cmd /c ".venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --host 127.0.0.1"
    timeout /t 2 /nobreak >nul
)

:: 2. Verify / start Next.js frontend if not running
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Starting SentinelOps Web Console...
    cd /d "D:\sentinelops-ai\web"
    start /min "SentinelOps Web Console" cmd /c "npx next start -p 3000"
    timeout /t 3 /nobreak >nul
)

:: 3. Launch dedicated standalone desktop application window
echo [INFO] Launching SentinelOps AI Desktop Application...
start chrome.exe --app="http://localhost:3000/dashboard" 2>nul
if %ERRORLEVEL% EQU 0 exit /b 0

start msedge.exe --app="http://localhost:3000/dashboard" 2>nul
if %ERRORLEVEL% EQU 0 exit /b 0

start http://localhost:3000/dashboard
exit /b 0
