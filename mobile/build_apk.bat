@echo off
setlocal
echo ==========================================================
echo 🚀 SentinelOps Mobile Android APK Auto-Builder
echo ==========================================================

powershell.exe -ExecutionPolicy Bypass -File "%~dp0build_apk.ps1" %*
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ APK Build Failed with error code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ✅ Build complete. APK stored in releases/ and web/public/downloads/.
pause

