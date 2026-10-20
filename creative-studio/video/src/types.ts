export interface VideoScene {
  id: number;
  type: 'hero' | 'tension' | 'mockup_3d' | 'metrics' | 'cta';
  headline: string;
  subtext: string;
  duration_seconds: number;
}

export interface CommercialProps {
  brandName?: string;
  tagline?: string;
  primaryColor?: string;
  accentColor?: string;
  scenes?: VideoScene[];
}
