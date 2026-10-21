import { registerRoot, Composition } from 'remotion';
import React from 'react';
import { Commercial } from './Commercial';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Commercial"
      component={Commercial}
      durationInFrames={60 * 19} // 19 seconds at 60fps
      fps={60}
      width={1920}
      height={1080}
      defaultProps={{
        brandName: 'SENTINELOPS AI',
        tagline: 'GUARDRAILS THAT ACTUALLY ENFORCE',
        primaryColor: '#06b6d4',
        accentColor: '#f43f5e',
      }}
    />
  );
};

registerRoot(RemotionRoot);
