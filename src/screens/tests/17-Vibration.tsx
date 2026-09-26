import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

const HAPTIC_TYPES = [
  { label: 'Light', run: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) },
  { label: 'Medium', run: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) },
  { label: 'Heavy', run: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy) },
  { label: 'Success', run: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) },
  { label: 'Warning', run: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning) },
  { label: 'Error', run: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error) },
];

export function VibrationTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [lastTapped, setLastTapped] = useState<string | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const test = TEST_REGISTRY.find(t => t.id === 'vibration')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'vibration');

  const handleTap = async (type: typeof HAPTIC_TYPES[number]) => {
    await type.run();
    setLastTapped(type.label);
    setTapCount(prev => prev + 1);
  };

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <Text style={styles.hint}>Tap each button below and feel for the vibration.</Text>

        <View style={styles.grid}>
          {HAPTIC_TYPES.map((type) => (
            <TouchableOpacity
              key={type.label}
              style={[styles.hapticBtn, lastTapped === type.label && styles.hapticBtnActive]}
              onPress={() => handleTap(type)}
              activeOpacity={0.7}
            >
              <Text style={styles.hapticIcon}>📳</Text>
              <Text style={[styles.hapticLabel, lastTapped === type.label && styles.hapticLabelActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.statusBox, {
          backgroundColor: tapCount > 0 ? colors.accentDim : colors.surface,
          borderColor: tapCount > 0 ? colors.accent : colors.border,
        }]}>
          <Text style={[styles.statusText, { color: tapCount > 0 ? colors.accent : colors.textSecondary }]}>
            {tapCount > 0
              ? `Last: ${lastTapped} — Did you feel the vibration?`
              : 'Tap a button to trigger haptic feedback'}
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg },
  hint: { ...typography.callout, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  hapticBtn: { width: '30%', aspectRatio: 1, backgroundColor: colors.surface, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, gap: spacing.xs },
  hapticBtnActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  hapticIcon: { fontSize: 28 },
  hapticLabel: { ...typography.footnote, color: colors.textSecondary, fontWeight: '600' as const },
  hapticLabelActive: { color: colors.accent },
  statusBox: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.callout, textAlign: 'center', lineHeight: 22 },
});
