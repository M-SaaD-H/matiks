export const Colors = {
  background: '#0A0A1A',
  surface: '#12122A',
  surfaceLight: '#1C1C3A',
  accent: '#B0FA63',
  accentLight: '#D2FF9F',
  accentDim: '#8ABD4B',
  text: '#F0EDE6',
  textSecondary: '#8A8A9E',
  textMuted: '#5A5A70',
  white: '#FFFFFF',
  danger: '#FF6B6B',
  success: '#4ECDC4',
  comboText: '#B0FA63',
  comboBg: 'rgba(176, 250, 99, 0.12)',
  shimmer: 'rgba(255, 255, 255, 0.15)',
  shimmerBright: 'rgba(255, 255, 255, 0.7)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  confettiColors: ['#B0FA63', '#D2FF9F', '#8ABD4B', '#FFFFFF', '#4ECDC4', '#72F485'],
};

export const Fonts = {
  scoreSize: 64,
  scoreLabelSize: 15,
  comboSize: 20,
  rankSize: 18,
  rankNumberSize: 24,
  buttonSize: 16,
  headerSize: 14,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Animations = {
  durations: {
    xs: 150,
    sm: 300,
    md: 500,
    intermediate: 400,
    base: 600,
    lg: 800,
    oneSecond: 1000,
    xl: 1200,
    shimmer: 1500,
    long: 1800,
    slow: 2000,
    confetti: 3200,
  },
  spring: {
    default: { damping: 18, stiffness: 120, mass: 0.8 },
    bouncy: { damping: 12, stiffness: 140 },
    snappy: { damping: 18, stiffness: 140 },
    gentle: { damping: 20, stiffness: 150 },
  },
};
