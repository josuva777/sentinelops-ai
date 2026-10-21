# SentinelOps AI - Automated Android APK Build & Release Packaging Script
param(
    [string]$BuildType = "debug"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 SentinelOps Mobile Android APK Builder & Release System" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Resolve JDK 21 (Temurin / Android Studio JBR)
$JdkCandidates = @(
    "C:\Users\ELCOT\jdk-21.0.6+7",
    "C:\Program Files\Eclipse Adoptium\jdk-21*",
    "C:\Program Files\Java\jdk-21*",
    "C:\Users\ELCOT\New folder\jbr"
)

$ResolvedJdk = $null
foreach ($path in $JdkCandidates) {
    $found = Get-Item $path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found -and (Test-Path "$($found.FullName)\bin\java.exe")) {
        $ResolvedJdk = $found.FullName
        break
    }
}

if (-not $ResolvedJdk) {
    Write-Error "Could not locate a valid Java 21 JDK. Please set JAVA_HOME."
}

$env:JAVA_HOME = $ResolvedJdk
Write-Host "✓ JAVA_HOME set to: $ResolvedJdk" -ForegroundColor Green

# 2. Resolve Android SDK
$SdkPath = "C:\Users\ELCOT\AppData\Local\Android\Sdk"
if (-not (Test-Path $SdkPath)) {
    Write-Error "Android SDK not found at $SdkPath."
}
$env:ANDROID_HOME = $SdkPath
Write-Host "✓ ANDROID_HOME set to: $SdkPath" -ForegroundColor Green

# 3. Locate Gradle
$GradleBin = "C:\Users\ELCOT\gradle-8.10.2\bin\gradle.bat"
if (-not (Test-Path $GradleBin)) {
    $GradleBin = "gradle"
}
Write-Host "✓ Using Gradle: $GradleBin" -ForegroundColor Green

# 4. Target Directories
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$AndroidDir = Join-Path $ScriptDir "android"
$RootDir = Split-Path -Parent $ScriptDir
$ReleasesDir = Join-Path $RootDir "releases"
$WebDownloadsDir = Join-Path $RootDir "web\public\downloads"

if (-not (Test-Path $ReleasesDir)) {
    New-Item -ItemType Directory -Path $ReleasesDir -Force | Out-Null
}
if (-not (Test-Path $WebDownloadsDir)) {
    New-Item -ItemType Directory -Path $WebDownloadsDir -Force | Out-Null
}

# 5. Run Gradle Assemble
Write-Host "`n🔨 Running Gradle assemble$($BuildType.Substring(0,1).ToUpper() + $BuildType.Substring(1))..." -ForegroundColor Yellow
Push-Location $AndroidDir
try {
    & $GradleBin "assemble$($BuildType.Substring(0,1).ToUpper() + $BuildType.Substring(1))" --no-daemon
} finally {
    Pop-Location
}

# 6. Locate Output APK
$ApkDir = Join-Path $AndroidDir "app\build\outputs\apk\$BuildType"
$BuiltApk = Get-ChildItem -Path $ApkDir -Filter "*.apk" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($BuiltApk) {
    $ReleaseApkName = "sentinelops-agent-security-v1.0.0-$BuildType.apk"
    $DestReleaseApk = Join-Path $ReleasesDir $ReleaseApkName
    $DestWebApk = Join-Path $WebDownloadsDir "sentinelops-mobile.apk"

    Copy-Item $BuiltApk.FullName -Destination $DestReleaseApk -Force
    Copy-Item $BuiltApk.FullName -Destination $DestWebApk -Force

    $Hash = (Get-FileHash -Path $DestReleaseApk -Algorithm SHA256).Hash
    $Manifest = @{
        product = "SentinelOps AI Mobile SecOps Companion"
        version = "1.0.0"
        build_type = $BuildType
        package_name = "com.sentinelops.mobile"
        file_name = $ReleaseApkName
        sha256 = $Hash
        size_bytes = (Get-Item $DestReleaseApk).Length
        timestamp = (Get-Date).ToString("o")
        download_route = "/downloads/sentinelops-mobile.apk"
    } | ConvertTo-Json -Depth 4

    $ManifestPath = Join-Path $ReleasesDir "LATEST_RELEASE.json"
    Set-Content -Path $ManifestPath -Value $Manifest -Encoding UTF8

    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host "🎉 ANDROID APK BUILD & PACKAGING COMPLETE!" -ForegroundColor Green
    Write-Host "📦 Release APK: $DestReleaseApk" -ForegroundColor White
    Write-Host "🌐 Web Download: $DestWebApk" -ForegroundColor White
    Write-Host "🔒 SHA-256: $Hash" -ForegroundColor Cyan
    Write-Host "📄 Manifest: $ManifestPath" -ForegroundColor White
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Warning "Gradle build finished but output APK was not found in $ApkDir. Check build logs."
}

