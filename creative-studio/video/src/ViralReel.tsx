import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
  interpolate,
  spring,
  useCurrentFrame,
  staticFile,
  Audio,
  Img,
} from 'remotion';
import { captionsData, CaptionSentence } from './captions';

export const ViralReel: React.FC = () => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  // Find active sentence and active word for karaoke rendering
  const activeSentence = (captionsData as CaptionSentence[]).find(
    (s) => currentTime >= s.start - 0.2 && currentTime <= s.end + 0.3
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030712',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        width: 1080,
        height: 1920,
      }}
    >
      {/* 1. Dynamic Cyber Background Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.7,
        }}
      />

      {/* 2. Ambient Pulsing Core Light */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '20%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
          filter: 'blur(100px)',
          transform: `scale(${1 + Math.sin(frame / 20) * 0.1})`,
        }}
      />

      {/* 3. Top Social Channel Bar */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Img
            src={staticFile('branding/app_icon.png')}
            style={{ width: 48, height: 48, borderRadius: 12, border: '1px solid #10b981' }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '0.5px', color: '#ffffff' }}>
              SENTINELOPS AI
            </div>
            <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>DETERMINISTIC AGENT GUARDRAILS</div>
          </div>
        </div>

        <div
          style={{
            padding: '8px 16px',
            borderRadius: '999px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#ef4444',
            fontSize: 14,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 10px #ef4444',
            }}
          />
          <span>LIVE AUDIT</span>
        </div>
      </div>

      {/* AUDIO TRACKS & SOUND EFFECTS */}
      {/* 1. Tension Drone & Background Pulse */}
      <Audio src={staticFile('audio/bg_reel_tension.wav')} volume={0.4} />

      {/* 2. Neural Voiceover Track */}
      <Audio src={staticFile('audio/voice_reel.mp3')} volume={1.0} />

      {/* 3. Heartbeat at Scene 1 Hook */}
      <Sequence from={0} durationInFrames={60}>
        <Audio src={staticFile('audio/sfx_heartbeat.wav')} volume={0.8} />
      </Sequence>

      {/* 4. Threat Alarm at frame 280 */}
      <Sequence from={280} durationInFrames={70}>
        <Audio src={staticFile('audio/sfx_alarm.wav')} volume={0.65} />
      </Sequence>

      {/* 5. Laser Barrier Whoosh at frame 340 */}
      <Sequence from={340} durationInFrames={45}>
        <Audio src={staticFile('audio/sfx_whoosh.wav')} volume={0.8} />
      </Sequence>

      {/* 6. Approval Ping at frame 1100 */}
      <Sequence from={1100} durationInFrames={50}>
        <Audio src={staticFile('audio/sfx_ping.wav')} volume={0.75} />
      </Sequence>

      {/* 7. Outro Impact at frame 1420 */}
      <Sequence from={1420} durationInFrames={60}>
        <Audio src={staticFile('audio/sfx_impact.wav')} volume={0.85} />
      </Sequence>

      {/* SCENE 1: THE CRITICAL INCIDENT (0.0s - 5.5s / frames 0 - 330) */}
      <Sequence from={0} durationInFrames={330}>
        <div
          style={{
            position: 'absolute',
            top: 240,
            left: 60,
            right: 60,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            zIndex: 30,
          }}
        >
          {/* Incident Alert Badge */}
          <div
            style={{
              padding: '16px 24px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(15, 23, 42, 0.8))',
              border: '2px solid rgba(239, 68, 68, 0.6)',
              boxShadow: '0 0 35px -5px rgba(239, 68, 68, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ color: '#fca5a5', fontSize: 14, fontFamily: 'monospace', fontWeight: 700 }}>
                CRITICAL INTERCEPTION ALERT
              </div>
              <div style={{ color: '#ffffff', fontSize: 26, fontWeight: 900, marginTop: 4 }}>
                Rogue Agent Attempting Wire
              </div>
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: '#ef4444',
                fontFamily: 'monospace',
              }}
            >
              $84,000
            </div>
          </div>

          {/* Code Terminal View */}
          <div
            style={{
              borderRadius: 20,
              backgroundColor: '#090d16',
              border: '1px solid #1e293b',
              padding: 24,
              fontFamily: 'monospace',
              fontSize: 18,
              lineHeight: 1.6,
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981' }} />
            </div>
            <div style={{ color: '#64748b' }}>// Agent: FinReconcileBot (v4.0)</div>
            <div style={{ color: '#f43f5e' }}>POST /v1/treasury/initiate_settlement</div>
            <div style={{ color: '#e2e8f0', marginTop: 8 }}>{`{`}</div>
            <div style={{ paddingLeft: 24, color: '#93c5fd' }}>
              &quot;amount&quot;: <span style={{ color: '#f59e0b' }}>84000</span>,
            </div>
            <div style={{ paddingLeft: 24, color: '#93c5fd' }}>
              &quot;recipient&quot;: <span style={{ color: '#fca5a5' }}>&quot;Offshore Vendor Ltd&quot;</span>,
            </div>
            <div style={{ paddingLeft: 24, color: '#93c5fd' }}>
              &quot;currency&quot;: <span style={{ color: '#6ee7b7' }}>&quot;USD&quot;</span>
            </div>
            <div style={{ color: '#e2e8f0' }}>{`}`}</div>
          </div>
        </div>
      </Sequence>

      {/* SCENE 2: DETERMINISTIC INTERCEPTION (<12ms) (frames 330 - 640) */}
      <Sequence from={330} durationInFrames={310}>
        <div
          style={{
            position: 'absolute',
            top: 240,
            left: 60,
            right: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            zIndex: 30,
          }}
        >
          {/* Latency Meter Pill */}
          <div
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10b981',
              color: '#10b981',
              fontSize: 22,
              fontFamily: 'monospace',
              fontWeight: 800,
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
            }}
          >
            INTERCEPTION SPEED: 8ms
          </div>

          {/* Laser Guardrail Shield Box */}
          <div
            style={{
              width: '100%',
              borderRadius: 24,
              background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, rgba(2, 6, 23, 0.9) 100%)',
              border: '2px solid #10b981',
              padding: 32,
              textAlign: 'center',
              boxShadow: '0 0 50px -10px rgba(16, 185, 129, 0.5)',
            }}
          >
            <Img
              src={staticFile('branding/shield_emblem.png')}
              style={{ width: 140, height: 140, margin: '0 auto 20px', display: 'block' }}
            />
            <div style={{ fontSize: 32, fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
              PRE-FLIGHT GATEWAY ACTIVATED
            </div>
            <div style={{ color: '#94a3b8', fontSize: 16, marginTop: 8, fontFamily: 'monospace' }}>
              RULE: r_large_wire | OWASP LLM01 CONTAINMENT
            </div>
            <div
              style={{
                marginTop: 20,
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: 8,
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              AUTONOMOUS EXECUTION BLOCKED
            </div>
          </div>
        </div>
      </Sequence>

      {/* SCENE 3: 3D SMARTPHONE HUMAN APPROVAL MODAL (frames 640 - 1420) */}
      <Sequence from={640} durationInFrames={780}>
        <div
          style={{
            position: 'absolute',
            top: 220,
            left: 60,
            right: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 30,
          }}
        >
          {/* Smartphone Frame Simulation */}
          <div
            style={{
              width: 520,
              borderRadius: 44,
              border: '6px solid #334155',
              backgroundColor: '#020617',
              padding: 24,
              boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(16, 185, 129, 0.3)',
            }}
          >
            {/* Phone Speaker Notch */}
            <div
              style={{
                width: 120,
                height: 16,
                backgroundColor: '#1e293b',
                borderRadius: 999,
                margin: '0 auto 20px',
              }}
            />

            {/* Notification Card */}
            <div
              style={{
                padding: 20,
                borderRadius: 20,
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>SENTINELOPS MOBILE</span>
                <span style={{ fontSize: 12, color: '#f59e0b', fontFamily: 'monospace', fontWeight: 700 }}>
                  TTL: 14m 52s
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 8 }}>
                Executive Sign-off Required
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                FinReconcileBot requested $84,000 wire to Offshore Vendor Ltd.
              </div>
            </div>

            {/* Verification Hash */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                backgroundColor: 'rgba(0,0,0,0.4)',
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#64748b',
                marginBottom: 20,
              }}
            >
              TOKEN: SHA256: 9A82...B41E (Single-Use)
            </div>

            {/* Interactive Action Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: 14,
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 16,
                  textAlign: 'center',
                }}
              >
                Reject & Kill
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: 14,
                  backgroundColor: '#10b981',
                  color: '#020617',
                  fontWeight: 900,
                  fontSize: 16,
                  textAlign: 'center',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
                }}
              >
                Approve (1x)
              </div>
            </div>
          </div>
        </div>
      </Sequence>

      {/* SCENE 4: BRAND IDENTITY & OUTRO CALL TO ACTION (frames 1420 - 1798) */}
      <Sequence from={1420} durationInFrames={378}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
            textAlign: 'center',
            padding: '0 40px',
          }}
        >
          <Img
            src={staticFile('branding/shield_emblem.png')}
            style={{
              width: 220,
              height: 220,
              filter: 'drop-shadow(0 0 45px rgba(16, 185, 129, 0.7))',
              marginBottom: 24,
            }}
          />

          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: '-1px',
              color: '#ffffff',
              margin: 0,
            }}
          >
            SENTINELOPS AI
          </h1>

          <p
            style={{
              fontSize: 20,
              fontFamily: 'monospace',
              color: '#10b981',
              letterSpacing: '3px',
              marginTop: 12,
              fontWeight: 700,
            }}
          >
            SECURITY • OPERATIONS • INTELLIGENCE
          </p>

          <p
            style={{
              fontSize: 24,
              color: '#94a3b8',
              maxWidth: 700,
              marginTop: 20,
              lineHeight: 1.5,
            }}
          >
            The In-Line Pre-Flight Interception Gateway for Autonomous AI Agent Fleets.
          </p>

          <div
            style={{
              marginTop: 40,
              padding: '18px 48px',
              borderRadius: 20,
              backgroundColor: '#10b981',
              color: '#020617',
              fontSize: 24,
              fontWeight: 900,
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.8)',
            }}
          >
            Deploy Protection → sentinelops.ai
          </div>
        </div>
      </Sequence>

      {/* DYNAMIC VIRAL WORD-BY-WORD KARAOKE CAPTIONS (Alex Hormozi / TikTok Style) */}
      {activeSentence && (
        <div
          style={{
            position: 'absolute',
            bottom: 300,
            left: 60,
            right: 60,
            zIndex: 100,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            padding: '24px 32px',
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: 24,
            border: '2px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(16, 185, 129, 0.3)',
          }}
        >
          {activeSentence.words.map((w, i) => {
            const isWordActive = currentTime >= w.start && currentTime <= w.end;
            const isWordPast = currentTime > w.end;

            return (
              <span
                key={i}
                style={{
                  fontSize: isWordActive ? 42 : 36,
                  fontWeight: isWordActive ? 900 : 700,
                  color: isWordActive ? '#facc15' : isWordPast ? '#ffffff' : '#64748b',
                  transform: isWordActive ? 'scale(1.18)' : 'scale(1.0)',
                  transition: 'all 0.08s ease-out',
                  textShadow: isWordActive
                    ? '0 0 25px rgba(250, 204, 21, 0.9), 0 2px 4px #000000'
                    : '0 2px 4px rgba(0,0,0,0.8)',
                  display: 'inline-block',
                }}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
