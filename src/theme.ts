// Apple Liquid Glass Dark Theme
export const colors = {
  // Pure OLED true black
  background: '#000000',
  
  // Apple Liquid Glass & Materials
  glass: 'rgba(255, 255, 255, 0.07)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassElevated: 'rgba(255, 255, 255, 0.11)',
  glassActive: 'rgba(255, 255, 255, 0.18)',

  surface: '#121214',
  surfaceElevated: '#1C1C1E',

  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.65)',
  textTertiary: 'rgba(255, 255, 255, 0.38)',

  // Apple System Palette
  systemGreen: '#30D158',
  systemGreenDim: 'rgba(48, 209, 88, 0.18)',
  systemBlue: '#0A84FF',
  systemBlueDim: 'rgba(10, 132, 255, 0.18)',
  systemRed: '#FF453A',
  systemRedDim: 'rgba(255, 69, 58, 0.18)',
  systemOrange: '#FF9F0A',
  systemOrangeDim: 'rgba(255, 159, 10, 0.18)',

  // Semantic
  pass: '#30D158',
  passDim: 'rgba(48, 209, 88, 0.15)',
  fail: '#FF453A',
  failDim: 'rgba(255, 69, 58, 0.15)',
  skip: 'rgba(255, 255, 255, 0.3)',
  skipDim: 'rgba(255, 255, 255, 0.08)',
  accent: '#30D158',
  accentDim: 'rgba(48, 209, 88, 0.18)',

  border: 'rgba(255, 255, 255, 0.10)',
  separator: 'rgba(255, 255, 255, 0.08)',
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
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: -0.5, color: '#FFFFFF' },
  title1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.4, color: '#FFFFFF' },
  title2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3, color: '#FFFFFF' },
  title3: { fontSize: 20, fontWeight: '600' as const, letterSpacing: -0.2, color: '#FFFFFF' },
  headline: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2, color: '#FFFFFF' },
  body: { fontSize: 17, fontWeight: '400' as const, letterSpacing: -0.2, color: '#FFFFFF' },
  callout: { fontSize: 15, fontWeight: '400' as const, letterSpacing: -0.1, color: 'rgba(255,255,255,0.7)' },
  subheadline: { fontSize: 14, fontWeight: '500' as const, letterSpacing: -0.1, color: 'rgba(255,255,255,0.6)' },
  footnote: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0, color: 'rgba(255,255,255,0.45)' },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.2, color: 'rgba(255,255,255,0.4)' },
  metric: { fontSize: 56, fontWeight: '800' as const, letterSpacing: -2, color: '#FFFFFF' },
  metricMd: { fontSize: 36, fontWeight: '700' as const, letterSpacing: -1, color: '#FFFFFF' },
};
