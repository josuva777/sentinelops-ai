import { registerRoot, Composition } from 'remotion';
import React from 'react';
import { Commercial } from './Commercial';
import { ViralReel } from './ViralReel';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. VIRAL TECH STORYTELLING REEL (9:16 Vertical for Instagram Reels / TikTok / YouTube Shorts) */}
      <Composition
        id="ViralReel"
        component={ViralReel}
        durationInFrames={1798} // 29.97s at 60fps
        fps={60}
        width={1080}
        height={1920}
      />

      {/* 2. BROADCAST COMMERCIAL (16:9 Landscape for Website Hero / YouTube / Product Hunt) */}
      <Composition
        id="Commercial"
        component={Commercial}
        durationInFrames={60 * 19} // 19s at 60fps
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          brandName: 'SENTINELOPS AI',
          tagline: 'GUARDRAILS THAT ACTUALLY ENFORCE',
          primaryColor: '#10b981',
          accentColor: '#06b6d4',
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
