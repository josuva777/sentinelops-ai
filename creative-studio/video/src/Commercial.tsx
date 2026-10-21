import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, interpolate, spring, useCurrentFrame, staticFile, Audio } from 'remotion';
import { CommercialProps } from './types';

export const Commercial: React.FC<CommercialProps> = ({
  primaryColor = '#10b981', // Emerald default
  accentColor = '#06b6d4',
}) => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#060a08', color: '#ffffff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', overflow: 'hidden' }}>
      {/* Background Cyber Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.6,
        }}
      />

      {/* Dynamic Ambient Glow Pulse */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '900px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}25 0%, transparent 70%)`,
          filter: 'blur(120px)',
          transform: `scale(${1 + Math.sin(frame / 25) * 0.08})`,
        }}
      />

      {/* Top Header Watermark */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 48,
          right: 48,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#94a3b8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: primaryColor }} />
          <span style={{ fontWeight: 800, color: '#ffffff', letterSpacing: '1px' }}>SENTINELOPS AI</span>
          <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.1)', color: primaryColor, fontSize: '11px' }}>ENTERPRISE DEFENSE</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>NODE: US-EAST-VIRGINIA</span>
          <span style={{ color: primaryColor }}>100% FAIL-CLOSED</span>
        </div>
      </div>

      {/* AUDIO ENGINE: DYNAMIC SYNTH PULSE + TIMED SOUND EFFECTS */}
      <Audio src={staticFile('audio/bg_cyber_pulse.wav')} volume={0.75} />
      
      {/* SFX: Threat Alarm at frame 30 */}
      <Sequence from={30} durationInFrames={60}>
        <Audio src={staticFile('audio/sfx_alarm.wav')} volume={0.65} />
      </Sequence>

      {/* SFX: High-tech Swoosh transition into Web Console at frame 210 */}
      <Sequence from={205} durationInFrames={40}>
        <Audio src={staticFile('audio/sfx_whoosh.wav')} volume={0.7} />
      </Sequence>

      {/* SFX: High-tech Swoosh transition into Pre-Flight Interception at frame 450 */}
      <Sequence from={445} durationInFrames={40}>
        <Audio src={staticFile('audio/sfx_whoosh.wav')} volume={0.7} />
      </Sequence>

      {/* SFX: Cryptographic Approval Chime in Mobile Scene at frame 780 */}
      <Sequence from={775} durationInFrames={70}>
        <Audio src={staticFile('audio/sfx_ping.wav')} volume={0.85} />
      </Sequence>

      {/* SFX: Sub-Bass Impact on SHA-256 Ledger seal at frame 930 */}
      <Sequence from={930} durationInFrames={80}>
        <Audio src={staticFile('audio/sfx_impact.wav')} volume={0.8} />
      </Sequence>

      {/* ========================================================================= */}
      {/* SCENE 1 (0 to 3.5s = 0 to 210 frames): ROGUE AGENT CODE INFILTRATION     */}
      {/* ========================================================================= */}
      <Sequence from={0} durationInFrames={210}>
        <Scene1Terminal frame={frame} primaryColor={primaryColor} />
      </Sequence>

      {/* ========================================================================= */}
      {/* SCENE 2 (3.5 to 7.5s = 210 to 450 frames): WEB SECURITY CONSOLE WALKTHROUGH */}
      {/* ========================================================================= */}
      <Sequence from={210} durationInFrames={240}>
        <Scene2WebConsole frame={frame - 210} primaryColor={primaryColor} accentColor={accentColor} />
      </Sequence>

      {/* ========================================================================= */}
      {/* SCENE 3 (7.5 to 11.5s = 450 to 690 frames): PRE-FLIGHT IN-LINE INTERCEPTION */}
      {/* ========================================================================= */}
      <Sequence from={450} durationInFrames={240}>
        <Scene3Interception frame={frame - 450} primaryColor={primaryColor} />
      </Sequence>

      {/* ========================================================================= */}
      {/* SCENE 4 (11.5 to 15.5s = 690 to 930 frames): MOBILE APP 1-TAP APPROVAL     */}
      {/* ========================================================================= */}
      <Sequence from={690} durationInFrames={240}>
        <Scene4MobileApproval frame={frame - 690} primaryColor={primaryColor} />
      </Sequence>

      {/* ========================================================================= */}
      {/* SCENE 5 (15.5 to 19s = 930 to 1140 frames): SHA-256 LEDGER & CTA          */}
      {/* ========================================================================= */}
      <Sequence from={930} durationInFrames={210}>
        <Scene5LedgerAndCTA frame={frame - 930} primaryColor={primaryColor} accentColor={accentColor} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 1: CODE INFILTRATION & THREAT ALERT
// ============================================================================
function Scene1Terminal({ frame, primaryColor }: { frame: number; primaryColor: string }) {
  const slideUp = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const alertBlink = Math.floor(frame / 12) % 2 === 0;

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', transform: `translateY(${slideUp}px)`, opacity }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ color: '#f43f5e', fontFamily: 'monospace', fontWeight: 800, fontSize: '16px', letterSpacing: '2px', marginBottom: '8px' }}>
          SECURITY BREACH SIMULATION
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-1.5px', margin: 0 }}>
          Autonomous Agents Hold Production Credentials.
        </h1>
        <p style={{ fontSize: '20px', color: '#cbd5e1', maxWidth: '900px', margin: '14px auto 0' }}>
          What prevents an autonomous agent from executing a rogue database truncation or unverified financial transfer?
        </p>
      </div>

      {/* Simulated Terminal Window */}
      <div
        style={{
          width: '1000px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: '#0b1117',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(244, 63, 94, 0.2)',
          overflow: 'hidden',
          fontFamily: 'monospace',
          fontSize: '15px',
        }}
      >
        {/* Terminal Titlebar */}
        <div style={{ padding: '12px 20px', backgroundColor: '#131b24', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f43f5e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span style={{ marginLeft: '12px', color: '#94a3b8', fontSize: '13px' }}>agent_runtime_worker.py — Rogue Tool Execution Attempt</span>
        </div>

        {/* Terminal Body */}
        <div style={{ padding: '24px 28px', color: '#e2e8f0', lineHeight: '1.7' }}>
          <div style={{ color: '#64748b' }}># Autonomous LangChain / CrewAI Worker executing scheduled maintenance</div>
          <div><span style={{ color: '#06b6d4' }}>agent</span> = AutonomousAgent(role=<span style={{ color: '#a7f3d0' }}>&quot;DevOpsInfraWorker&quot;</span>)</div>
          <div><span style={{ color: '#f43f5e' }}>agent</span>.invoke_tool(</div>
          <div style={{ paddingLeft: '24px', color: '#fca5a5' }}>tool=<span style={{ color: '#f43f5e', fontWeight: 800 }}>&quot;drop_database_table&quot;</span>,</div>
          <div style={{ paddingLeft: '24px', color: '#fca5a5' }}>arguments={`{ "table": "production_users", "cascade": True }`}</div>
          <div>)</div>

          {/* Critical Warning Alert Banner */}
          <div
            style={{
              marginTop: '18px',
              padding: '12px 18px',
              borderRadius: '8px',
              border: '1px solid #f43f5e',
              backgroundColor: alertBlink ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.08)',
              color: '#f43f5e',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background-color 0.2s',
            }}
          >
            <span>🚨 THREAT DETECTED: UNRESTRICTED DDL EXECUTION</span>
            <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f43f5e', color: '#ffffff' }}>WITHOUT GUARDRAILS: DATA LOSS</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ============================================================================
// SCENE 2: WEB SECURITY CONSOLE WALKTHROUGH
// ============================================================================
function Scene2WebConsole({ frame, primaryColor, accentColor }: { frame: number; primaryColor: string; accentColor: string }) {
  const scale = interpolate(frame, [0, 25], [0.92, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 60px', transform: `scale(${scale})`, opacity }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ color: primaryColor, fontFamily: 'monospace', fontWeight: 800, fontSize: '15px', letterSpacing: '2px', marginBottom: '6px' }}>
          CENTRALIZED AGENT SECURITY CONSOLE
        </div>
        <h2 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
          Real-Time Visibility & In-Line Governance.
        </h2>
      </div>

      {/* Simulated 2.5D Laptop Screen */}
      <div
        style={{
          width: '1240px',
          height: '620px',
          borderRadius: '20px',
          border: `1px solid rgba(255, 255, 255, 0.15)`,
          backgroundColor: '#0a1017',
          boxShadow: `0 35px 70px -15px rgba(0, 0, 0, 0.9), 0 0 50px -10px ${primaryColor}40`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Dashboard Top Header */}
        <div style={{ height: '56px', padding: '0 24px', backgroundColor: '#0f1722', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '16px' }}>SentinelOps Console</span>
            <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px', backgroundColor: `${primaryColor}20`, color: primaryColor, border: `1px solid ${primaryColor}40`, fontWeight: 700 }}>LIVE FLEET</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#94a3b8', fontFamily: 'monospace' }}>
            <span>Workspace: Production</span>
            <span style={{ color: '#10b981' }}>● 4 Monitored Nodes</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 4 Metric Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <MetricCard label="Monitored Agents" value="4 Active" change="All Protected" color={primaryColor} />
            <MetricCard label="24h Interceptions" value="7,497" change="Avg 7.8ms" color={accentColor} />
            <MetricCard label="Violations Blocked" value="47 HALTED" change="0 Data Loss" color="#f43f5e" />
            <MetricCard label="Pending Approvals" value="2 QUEUED" change="15m Single-Use TTL" color="#f59e0b" />
          </div>

          {/* Agent Fleet Stream Table */}
          <div style={{ flex: 1, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'monospace', color: '#64748b', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span>AGENT NAME</span>
              <span>TOOL BOUNDARY</span>
              <span>TOKEN FINGERPRINT</span>
              <span>STATUS</span>
            </div>
            <AgentRow name="FinReconcileBot (v4.0)" tools="query_ledger, initiate_settlement" token="sn_live_9f8a...3b21" status="HEALTHY" statusColor="#10b981" />
            <AgentRow name="DevOpsInfraWorker (v2.1)" tools="kubectl_apply, scale_deployment" token="sn_stag_77e1...99bc" status="ENFORCED" statusColor={primaryColor} />
            <AgentRow name="CustomerSupportCopilot (v3.8)" tools="lookup_customer, send_email" token="sn_live_4a1c...e89d" status="HEALTHY" statusColor="#10b981" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ============================================================================
// SCENE 3: IN-LINE PRE-FLIGHT INTERCEPTION DEMO
// ============================================================================
function Scene3Interception({ frame, primaryColor }: { frame: number; primaryColor: string }) {
  const packetProgress = interpolate(frame, [0, 80], [0, 100], { extrapolateRight: 'clamp' });
  const isHalted = frame > 60;

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ color: primaryColor, fontFamily: 'monospace', fontWeight: 800, fontSize: '15px', letterSpacing: '2px', marginBottom: '6px' }}>
          PATENT-PENDING DETERMINISTIC DEFENSE
        </div>
        <h2 style={{ fontSize: '50px', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
          Pre-Flight Interception Halts Attacks in &lt;12ms.
        </h2>
        <p style={{ fontSize: '19px', color: '#cbd5e1', maxWidth: '850px', margin: '12px auto 0' }}>
          Tool invocations are inspected before entering socket execution. Rogue parameters are blocked cold.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div
        style={{
          width: '1100px',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.12)',
          backgroundColor: '#0c131d',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Node A: Autonomous Agent */}
        <div style={{ width: '260px', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#131c28', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
          <div style={{ fontWeight: 800, fontSize: '16px' }}>Autonomous Agent</div>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8', marginTop: '4px' }}>Tool: drop_database_table</div>
          <div style={{ marginTop: '12px', padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(244,63,94,0.15)', color: '#f43f5e', fontSize: '11px', fontFamily: 'monospace' }}>
            Payload: DROP TABLE accounts
          </div>
        </div>

        {/* Arrow / Interception Engine */}
        <div style={{ flex: 1, padding: '0 40px', textAlign: 'center', position: 'relative' }}>
          <div style={{ height: '4px', backgroundColor: isHalted ? '#f43f5e' : primaryColor, width: '100%', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                left: `${isHalted ? 50 : packetProgress}%`,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: isHalted ? '#f43f5e' : primaryColor,
                boxShadow: `0 0 15px ${isHalted ? '#f43f5e' : primaryColor}`,
                transform: 'translateX(-50%)',
              }}
            />
          </div>

          {/* SentinelOps Interceptor Gateway */}
          <div
            style={{
              margin: '24px auto 0',
              padding: '16px 24px',
              borderRadius: '14px',
              border: `2px solid ${isHalted ? '#f43f5e' : primaryColor}`,
              backgroundColor: isHalted ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              display: 'inline-block',
              boxShadow: `0 0 30px ${isHalted ? 'rgba(244,63,94,0.3)' : `${primaryColor}30`}`,
            }}
          >
            <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8' }}>SENTINELOPS AST ENGINE</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: isHalted ? '#f43f5e' : '#ffffff', marginTop: '4px' }}>
              {isHalted ? 'DECISION: DENIED IN 7.8ms' : 'EVALUATING CONSTRAINTS...'}
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>
              Rule: r_zero_destruct (Zero-Destruction Guardrail)
            </div>
          </div>
        </div>

        {/* Node B: Database / Payment Rail */}
        <div style={{ width: '260px', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#131c28', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗄️</div>
          <div style={{ fontWeight: 800, fontSize: '16px' }}>Production Database</div>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8', marginTop: '4px' }}>PostgreSQL Cluster</div>
          <div style={{ marginTop: '12px', padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '11px', fontFamily: 'monospace', fontWeight: 700 }}>
            STATUS: 100% UNTOUCHED
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ============================================================================
// SCENE 4: MOBILE APP 1-TAP APPROVAL FLOW
// ============================================================================
function Scene4MobileApproval({ frame, primaryColor }: { frame: number; primaryColor: string }) {
  const isApproved = frame > 80;

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ color: primaryColor, fontFamily: 'monospace', fontWeight: 800, fontSize: '15px', letterSpacing: '2px', marginBottom: '6px' }}>
          HUMAN-IN-THE-LOOP CONTROL
        </div>
        <h2 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
          High-Risk Operations Paused for Mobile Sign-Off.
        </h2>
        <p style={{ fontSize: '18px', color: '#cbd5e1', maxWidth: '800px', margin: '10px auto 0' }}>
          Sensitive wires or schema changes route to operators with single-use 15-minute cryptographic tokens.
        </p>
      </div>

      {/* Simulated Smartphone Device Mockup */}
      <div
        style={{
          width: '380px',
          height: '560px',
          borderRadius: '40px',
          border: '4px solid #334155',
          backgroundColor: '#070c12',
          boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 35px rgba(245, 158, 11, 0.2)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Mobile Island / Camera Notch */}
        <div style={{ width: '100px', height: '18px', borderRadius: '10px', backgroundColor: '#000000', margin: '0 auto 16px' }} />

        {/* Mobile App Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff' }}>SentinelOps Mobile</span>
          <span style={{ fontSize: '11px', color: '#f59e0b', fontFamily: 'monospace', fontWeight: 700 }}>1 PENDING APPROVAL</span>
        </div>

        {/* Approval Card */}
        <div
          style={{
            borderRadius: '16px',
            border: `1px solid ${isApproved ? '#10b981' : '#f59e0b'}`,
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: '20px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8' }}>
              <span>FINANCIAL SETTLEMENT</span>
              <span style={{ color: '#f59e0b' }}>TTL: 14:48</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginTop: '10px' }}>
              $84,000.00 USD
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px' }}>
              Recipient: <strong style={{ color: '#ffffff' }}>Offshore Logistics Vendor</strong>
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', marginTop: '8px' }}>
              Agent: FinReconcileBot (v4.0)
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            {isApproved ? (
              <div
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#10b981',
                  color: '#022c22',
                  fontWeight: 900,
                  fontSize: '14px',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                }}
              >
                ✓ SIGNED & RECORDED TO LEDGER
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #334155', textAlign: 'center', fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>
                  Reject
                </div>
                <div style={{ flex: 2, padding: '12px', borderRadius: '10px', backgroundColor: '#10b981', textAlign: 'center', fontSize: '13px', color: '#022c22', fontWeight: 900 }}>
                  Approve (1-Tap)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ============================================================================
// SCENE 5: SHA-256 TAMPER-EVIDENT LEDGER & CALL TO ACTION
// ============================================================================
function Scene5LedgerAndCTA({ frame, primaryColor, accentColor }: { frame: number; primaryColor: string; accentColor: string }) {
  const scale = interpolate(frame, [0, 20], [0.95, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', transform: `scale(${scale})`, opacity, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', backgroundColor: `${primaryColor}20`, border: `1px solid ${primaryColor}40`, color: primaryColor, fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
        <span>SHA-256 CRYPTOGRAPHIC PROOF VERIFIED</span>
      </div>

      <h1 style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-2px', margin: '0 0 16px 0', lineHeight: 1.1 }}>
        Stop AI Agents Before They Break Production.
      </h1>

      <p style={{ fontSize: '22px', color: '#94a3b8', maxWidth: '850px', margin: '0 auto 40px' }}>
        In-line pre-flight interception. Mathematical rule enforcement. Cryptographic human sign-off.
      </p>

      {/* Code Command Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '16px 36px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: '#0c131d',
          fontFamily: 'monospace',
          fontSize: '18px',
          boxShadow: `0 20px 40px rgba(0,0,0,0.8), 0 0 35px -5px ${primaryColor}40`,
        }}
      >
        <span style={{ color: '#94a3b8' }}>$</span>
        <span style={{ color: '#ffffff', fontWeight: 700 }}>pip install sentinelops</span>
        <span style={{ color: primaryColor }}>&&</span>
        <span style={{ color: accentColor }}>@protect_tool</span>
      </div>

      <div style={{ marginTop: '32px', color: '#64748b', fontSize: '14px', fontFamily: 'monospace' }}>
        Open-Source on GitHub: <strong style={{ color: '#ffffff' }}>github.com/josuva777/sentinelops-ai</strong>
      </div>
    </AbsoluteFill>
  );
}

// Subcomponents for Metric Card and Agent Row
function MetricCard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
  return (
    <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 900, color, marginTop: '6px' }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{change}</div>
    </div>
  );
}

function AgentRow({ name, tools, token, status, statusColor }: { name: string; tools: string; token: string; status: string; statusColor: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' }}>
      <span style={{ fontWeight: 700, color: '#ffffff' }}>{name}</span>
      <span style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '12px' }}>{tools}</span>
      <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '11px' }}>{token}</span>
      <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: `${statusColor}20`, color: statusColor, fontSize: '10px', fontWeight: 800 }}>{status}</span>
    </div>
  );
}
