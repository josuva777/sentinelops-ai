# SentinelOps AI — Mobile Release Center

This directory stores compiled release packages, Android APK binaries, and cryptographic SHA-256 release manifests for the SentinelOps mobile security companion.

---

## 📱 Release Packaging Workflow

### 1. Build Android APK Locally
Run the auto-builder from the repository root:
```powershell
.\mobile\build_apk.bat
# or in PowerShell:
.\mobile\build_apk.ps1 -BuildType debug
```

The script automatically:
1. Detects Temurin OpenJDK 21 (`C:\Users\ELCOT\jdk-21.0.6+7`) or Android Studio JBR.
2. Targets local Android SDK (`C:\Users\ELCOT\AppData\Local\Android\Sdk`).
3. Runs Gradle assemble.
4. Copies the output APK to `releases/sentinelops-agent-security-v1.0.0-debug.apk`.
5. Deploys a web download asset to `web/public/downloads/sentinelops-mobile.apk`.
6. Generates `LATEST_RELEASE.json` with cryptographic SHA-256 checksum.

---

## 📂 Release Assets
- `LATEST_RELEASE.json`: Checksum manifest, version tags, and build metadata.
- `sentinelops-agent-security-v1.0.0-debug.apk`: Standalone debug APK for side-loading or Android Studio emulator testing.
