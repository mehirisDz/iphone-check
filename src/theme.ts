// Updated theme to match dark neon reference UI
export const colors = {
  // Backgrounds
  background: '#0D0D0D',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textTertiary: '#636366',

  // Accent — neon lime (dominant in refs)
  accent: '#C6FF00',
  accentDim: 'rgba(198,255,0,0.15)',
  accentBlue: '#007AFF',
  accentBlueDim: 'rgba(0,122,255,0.15)',

  // State
  pass: '#C6FF00',
  passDim: 'rgba(198,255,0,0.15)',
  fail: '#FF3B30',
  failDim: 'rgba(255,59,48,0.15)',
  skip: '#636366',
  skipDim: 'rgba(99,99,102,0.20)',
  warn: '#FF9F0A',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  separator: 'rgba(255,255,255,0.06)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.37, color: '#FFFFFF' },
  title1: { fontSize: 28, fontWeight: '700' as const, color: '#FFFFFF' },
  title2: { fontSize: 22, fontWeight: '700' as const, color: '#FFFFFF' },
  title3: { fontSize: 20, fontWeight: '600' as const, color: '#FFFFFF' },
  headline: { fontSize: 17, fontWeight: '600' as const, color: '#FFFFFF' },
  body: { fontSize: 17, fontWeight: '400' as const, color: '#FFFFFF' },
  callout: { fontSize: 16, fontWeight: '400' as const, color: '#AEAEB2' },
  subheadline: { fontSize: 15, fontWeight: '400' as const, color: '#AEAEB2' },
  footnote: { fontSize: 13, fontWeight: '400' as const, color: '#636366' },
  caption: { fontSize: 12, fontWeight: '400' as const, color: '#636366' },
  // Large live reading number
  metric: { fontSize: 64, fontWeight: '700' as const, color: '#C6FF00', letterSpacing: -2 },
  metricMd: { fontSize: 40, fontWeight: '700' as const, color: '#C6FF00', letterSpacing: -1 },
};
