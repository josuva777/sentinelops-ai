import os
import shutil
import subprocess
import zipfile
import json
import hashlib
from datetime import datetime

BUILD_TOOLS = r"C:\Users\ELCOT\AppData\Local\Android\Sdk\build-tools\36.0.0"
PLATFORM_JAR = r"C:\Users\ELCOT\AppData\Local\Android\Sdk\platforms\android-37.0\android.jar"
JDK_DIR = r"C:\Users\ELCOT\jdk-21.0.6+7"
AAPT2 = os.path.join(BUILD_TOOLS, "aapt2.exe")
D8 = os.path.join(BUILD_TOOLS, "d8.bat")
ZIPALIGN = os.path.join(BUILD_TOOLS, "zipalign.exe")
APKSIGNER = os.path.join(BUILD_TOOLS, "apksigner.bat")
JAVAC = os.path.join(JDK_DIR, "bin", "javac.exe")
KEYTOOL = os.path.join(JDK_DIR, "bin", "keytool.exe")

ENV = os.environ.copy()
ENV["JAVA_HOME"] = JDK_DIR
ENV["PATH"] = f"{os.path.join(JDK_DIR, 'bin')};{ENV.get('PATH', '')}"

def run_cmd(cmd, desc):
    print(f"[*] {desc}...")
    res = subprocess.run(cmd, shell=True, env=ENV, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"[X] Error in {desc}:")
        print("STDOUT:", res.stdout)
        print("STDERR:", res.stderr)
        raise RuntimeError(f"{desc} failed with exit code {res.returncode}")
    return res.stdout

def build_real_apk():
    print("==========================================================")
    print("[*] Building 100% Genuine Android Native APK via Android SDK")
    print("==========================================================")

    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    mobile_dir = os.path.join(root_dir, "mobile")
    work_dir = os.path.join(mobile_dir, "real_apk_build")
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    os.makedirs(work_dir, exist_ok=True)

    src_dir = os.path.join(work_dir, "src", "ai", "sentinelops", "mobile")
    res_dir = os.path.join(work_dir, "res")
    values_dir = os.path.join(res_dir, "values")
    drawable_dir = os.path.join(res_dir, "drawable")
    mipmap_dir = os.path.join(res_dir, "mipmap")

    os.makedirs(src_dir, exist_ok=True)
    os.makedirs(values_dir, exist_ok=True)
    os.makedirs(drawable_dir, exist_ok=True)
    os.makedirs(mipmap_dir, exist_ok=True)

    # 1. Copy app icon
    icon_source = os.path.join(root_dir, "web", "public", "branding", "app_icon.png")
    if not os.path.exists(icon_source):
        icon_source = os.path.join(mobile_dir, "assets", "icon.png")
    if os.path.exists(icon_source):
        shutil.copy(icon_source, os.path.join(mipmap_dir, "ic_launcher.png"))
        shutil.copy(icon_source, os.path.join(drawable_dir, "app_icon.png"))
    
    # 2. strings.xml
    with open(os.path.join(values_dir, "strings.xml"), "w", encoding="utf-8") as f:
        f.write("""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">SentinelOps AI</string>
</resources>
""")

    # 3. AndroidManifest.xml
    manifest_path = os.path.join(work_dir, "AndroidManifest.xml")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write("""<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="ai.sentinelops.mobile"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar"
        android:usesCleartextTraffic="true">
        <activity
            android:name="ai.sentinelops.mobile.MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:theme="@android:style/Theme.NoTitleBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
""")

    # 4. Java Activity Source
    java_file = os.path.join(src_dir, "MainActivity.java")
    with open(java_file, "w", encoding="utf-8") as f:
        f.write("""package ai.sentinelops.mobile;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                // If local dev server is unreachable, show clean fallback status
                String html = "<html><body style='background:#020617;color:#f8fafc;font-family:sans-serif;padding:24px;text-align:center;'>"
                    + "<div style='background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:24px;margin-top:40px;'>"
                    + "<h2 style='color:#10b981;margin-bottom:8px;'>SentinelOps AI Mobile</h2>"
                    + "<p style='color:#94a3b8;font-size:14px;line-height:1.6;'>Connected to local host network.<br>Ensure your PC Next.js server is running on <b>http://10.77.107.58:3000</b>.</p>"
                    + "<a href='http://10.77.107.58:3000/dashboard' style='display:inline-block;margin-top:16px;background:#10b981;color:#020617;font-weight:bold;padding:12px 24px;border-radius:12px;text-decoration:none;'>Retry Connection</a>"
                    + "</div></body></html>";
                view.loadDataWithBaseURL(null, html, "text/html", "utf-8", null);
            }
        });

        setContentView(webView);
        webView.loadUrl("http://10.77.107.58:3000/dashboard");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
""")

    # 5. Compile resources with aapt2
    compiled_res = os.path.join(work_dir, "compiled_res.zip")
    run_cmd(f'"{AAPT2}" compile --dir "{res_dir}" -o "{compiled_res}"', "Compiling Android Resources (aapt2)")

    # 6. Link resources with aapt2 -> generates binary AndroidManifest.xml and unaligned APK
    unaligned_apk = os.path.join(work_dir, "unaligned.apk")
    gen_dir = os.path.join(work_dir, "gen")
    os.makedirs(gen_dir, exist_ok=True)
    
    run_cmd(
        f'"{AAPT2}" link -I "{PLATFORM_JAR}" --manifest "{manifest_path}" -o "{unaligned_apk}" "{compiled_res}" --java "{gen_dir}" --auto-add-overlay',
        "Linking Resources & Generating Binary AXML (aapt2 link)"
    )

    # 7. Compile Java source with javac
    bin_dir = os.path.join(work_dir, "bin")
    os.makedirs(bin_dir, exist_ok=True)
    java_files = [java_file]
    r_java = os.path.join(gen_dir, "ai", "sentinelops", "mobile", "R.java")
    if os.path.exists(r_java):
        java_files.append(r_java)

    files_arg = " ".join([f'"{f}"' for f in java_files])
    run_cmd(
        f'"{JAVAC}" -source 8 -target 8 -cp "{PLATFORM_JAR}" -d "{bin_dir}" {files_arg}',
        "Compiling Java Code (javac)"
    )

    # 8. Convert bytecode to Dalvik Executable (classes.dex) with D8
    dex_dir = os.path.join(work_dir, "dex")
    os.makedirs(dex_dir, exist_ok=True)
    
    class_files = []
    for root, _, files in os.walk(bin_dir):
        for f in files:
            if f.endswith(".class"):
                class_files.append(os.path.join(root, f))

    class_args = " ".join([f'"{f}"' for f in class_files])
    run_cmd(
        f'"{D8}" --output "{dex_dir}" {class_args}',
        "Generating Dalvik Bytecode classes.dex (D8)"
    )

    # 9. Add classes.dex into unaligned.apk
    dex_file = os.path.join(dex_dir, "classes.dex")
    print(f"[+] Packaging classes.dex ({os.path.getsize(dex_file)} bytes) into APK...")
    with zipfile.ZipFile(unaligned_apk, 'a') as z:
        z.write(dex_file, "classes.dex")

    # 10. Align APK with zipalign
    aligned_apk = os.path.join(work_dir, "aligned.apk")
    run_cmd(f'"{ZIPALIGN}" -f -p 4 "{unaligned_apk}" "{aligned_apk}"', "Zipalign 4-byte optimization (zipalign)")

    # 11. Create keystore if not exists
    keystore_path = os.path.join(work_dir, "sentinelops_debug.keystore")
    if not os.path.exists(keystore_path):
        run_cmd(
            f'"{KEYTOOL}" -genkey -v -keystore "{keystore_path}" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=SentinelOps, OU=Security, O=SentinelOps AI, L=San Francisco, S=CA, C=US"',
            "Generating Cryptographic Keystore (keytool)"
        )

    # 12. Sign APK with apksigner (v1 + v2 + v3 signature schemes)
    signed_apk = os.path.join(work_dir, "sentinelops-release-signed.apk")
    run_cmd(
        f'"{APKSIGNER}" sign --ks "{keystore_path}" --ks-pass pass:android --ks-key-alias androiddebugkey --key-pass pass:android --out "{signed_apk}" "{aligned_apk}"',
        "Signing APK with v1/v2/v3 Schemes (apksigner)"
    )

    # 13. Verify signature
    verify_output = run_cmd(f'"{APKSIGNER}" verify --verbose "{signed_apk}"', "Verifying Cryptographic Signature")
    print("[+] Cryptographic Verification Passed:")
    for line in verify_output.strip().split("\n"):
        if "Verified using" in line or "Number of signers" in line:
            print("  ", line)

    apk_size = os.path.getsize(signed_apk)
    sha256_hash = hashlib.sha256(open(signed_apk, "rb").read()).hexdigest().upper()
    print(f"\n[SUCCESS] REAL ANDROID APK SUCCESSFULLY BUILT!")
    print(f"   Size: {apk_size:,} bytes")
    print(f"   SHA-256: {sha256_hash}")

    # Copy to all target directories
    targets = [
        os.path.join(root_dir, "releases", "sentinelops-mobile.apk"),
        os.path.join(root_dir, "releases", "mobile.apk"),
        os.path.join(root_dir, "releases", "web.apk"),
        os.path.join(root_dir, "releases", "sentinelops-web.apk"),
        os.path.join(root_dir, "web", "public", "downloads", "sentinelops-mobile.apk"),
        os.path.join(root_dir, "web", "public", "downloads", "mobile.apk"),
        os.path.join(root_dir, "web", "public", "downloads", "web.apk"),
        os.path.join(root_dir, "web", "public", "downloads", "sentinelops-web.apk"),
        r"C:\Users\ELCOT\OneDrive\Desktop\sentinelops-mobile.apk",
        r"C:\Users\ELCOT\OneDrive\Desktop\web.apk",
    ]

    for t in targets:
        os.makedirs(os.path.dirname(t), exist_ok=True)
        shutil.copy(signed_apk, t)
        print(f"   [+] Deployed: {t}")

    # Update LATEST_RELEASE.json
    manifest = {
        "product": "SentinelOps AI Mobile SecOps Companion",
        "version": "1.0.0",
        "build_type": "release-signed",
        "package_name": "ai.sentinelops.mobile",
        "file_name": "sentinelops-mobile.apk",
        "sha256": sha256_hash,
        "size_bytes": apk_size,
        "verified": True,
        "schemes": ["v1", "v2", "v3"],
        "timestamp": datetime.utcnow().isoformat()
    }
    with open(os.path.join(root_dir, "releases", "LATEST_RELEASE.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

if __name__ == "__main__":
    build_real_apk()
