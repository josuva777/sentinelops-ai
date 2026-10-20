import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, interpolate, spring, useCurrentFrame } from 'remotion';
import { CommercialProps } from './types';

export const Commercial: React.FC<CommercialProps> = ({
  brandName = 'SENTINELOPS AI',
  tagline = 'GUARDRAILS THAT ACTUALLY ENFORCE',
  primaryColor = '#06b6d4',
  accentColor = '#f43f5e',
  scenes = [
    { id: 1, type: 'tension', headline: 'AUTONOMOUS AGENTS HAVE PRODUCTION KEYS.', subtext: 'What happens when an agent hallucinates DROP TABLE or wires unverified funds?', duration_seconds: 3.5 },
    { id: 2, type: 'hero', headline: 'INTRODUCING SENTINELOPS AI', subtext: 'The deterministic in-line gateway that halts dangerous tool calls before execution.', duration_seconds: 3.5 },
    { id: 3, type: 'mockup_3d', headline: 'IN-LINE PRE-FLIGHT INTERCEPTION', subtext: 'AST parameter analysis halts rogue commands in under 12 milliseconds.', duration_seconds: 4.5 },
    { id: 4, type: 'metrics', headline: '100% FAIL-CLOSED SECURITY', subtext: 'Single-use 15-minute TTL tokens bound to human approval queues.', duration_seconds: 3.5 },
    { id: 5, type: 'cta', headline: 'SENTINELOPS AI', subtext: 'Deploy the Python SDK. Guard your agents today.', duration_seconds: 4.0 },
  ],
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  let accumulatedFrames = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#080b11', color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Precision ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      {scenes.map((scene) => {
        const sceneDuration = Math.round(scene.duration_seconds * fps);
        const fromFrame = accumulatedFrames;
        accumulatedFrames += sceneDuration;

        return (
          <Sequence key={scene.id} from={fromFrame} durationInFrames={sceneDuration}>
            <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px' }}>
              <div
                style={{
                  textAlign: 'center',
                  maxWidth: '1200px',
                  transform: `translateY(${interpolate(frame - fromFrame, [0, 20], [20, 0], { extrapolateRight: 'clamp' })}px)`,
                  opacity: interpolate(frame - fromFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
                }}
              >
                {/* Scene Headline */}
                <h1
                  style={{
                    fontSize: scene.type === 'cta' ? '88px' : '64px',
                    fontWeight: 900,
                    letterSpacing: '-2px',
                    color: scene.type === 'tension' ? accentColor : '#ffffff',
                    lineHeight: 1.1,
                    textShadow: `0 10px 40px ${primaryColor}44`,
                  }}
                >
                  {scene.headline}
                </h1>

                {/* Scene Subtext */}
                <p
                  style={{
                    fontSize: '28px',
                    fontWeight: 500,
                    color: scene.type === 'cta' ? primaryColor : '#94a3b8',
                    marginTop: '24px',
                    lineHeight: 1.4,
                  }}
                >
                  {scene.subtext}
                </p>

                {/* Visual Pill for specific scenes */}
                {scene.type === 'metrics' && (
                  <div
                    style={{
                      marginTop: '40px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 28px',
                      borderRadius: '16px',
                      backgroundColor: `${primaryColor}15`,
                      border: `1px solid ${primaryColor}66`,
                      fontFamily: 'monospace',
                      fontSize: '20px',
                      color: primaryColor,
                      fontWeight: 700,
                    }}
                  >
                    <span>&lt; 12ms LATENCY</span>
                    <span>•</span>
                    <span>SHA-256 HASH CHAINED</span>
                  </div>
                )}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
