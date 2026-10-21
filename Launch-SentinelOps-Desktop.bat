@echo off
title SentinelOps AI - Desktop App Launcher
echo ==========================================================
echo 🚀 Launching SentinelOps AI Desktop App Window...
echo ==========================================================

:: Attempt to open Chrome in app mode (no browser address bar, looks like native desktop window)
start chrome.exe --app="http://localhost:3000/dashboard" 2>nul
if %ERRORLEVEL% EQU 0 exit /b 0

:: Attempt Edge in app mode
start msedge.exe --app="http://localhost:3000/dashboard" 2>nul
if %ERRORLEVEL% EQU 0 exit /b 0

:: Default browser fallback
start http://localhost:3000/dashboard
exit /b 0

