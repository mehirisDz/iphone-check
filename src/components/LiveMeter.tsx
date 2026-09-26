import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

interface Props {
  value: number;
  label?: string;
  unit?: string;
  displayValue?: string;
  color?: string;
}

export function LiveMeter({ value, label, unit, displayValue, color = colors.accent }: Props) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(widthAnim, { toValue: Math.max(0, Math.min(1, value)), useNativeDriver: false, tension: 40, friction: 8 }).start();
  }, [value]);
  const animatedWidth = widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {displayValue && <Text style={[styles.value, { color }]}>{displayValue}{unit ? ` ${unit}` : ''}</Text>}
        </View>
      )}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: animatedWidth, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: spacing.xs },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { ...typography.footnote, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '600' as const },
  value: { ...typography.title3, fontWeight: '700' as const },
  track: { height: 8, backgroundColor: colors.surface, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radius.pill },
});
