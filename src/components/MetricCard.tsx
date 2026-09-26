import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

interface Props {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
  dimBg?: string;
  fullWidth?: boolean;
}

export function MetricCard({ label, value, unit, accent = colors.accent, dimBg = colors.accentDim, fullWidth }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: dimBg }, fullWidth ? styles.fullWidth : null]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Text style={[styles.value, { color: accent }]}>{value}</Text>
        {unit && <Text style={[styles.unit, { color: accent }]}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, padding: spacing.md, borderRadius: radius.lg, minWidth: 120 },
  fullWidth: { flex: 0, width: '100%' },
  label: { ...typography.footnote, color: colors.textSecondary, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '600' as const },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -1 },
  unit: { fontSize: 14, fontWeight: '600' as const, marginBottom: 4 },
});
