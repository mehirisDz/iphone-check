import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

// Expo doesn't expose proximity sensor directly in managed workflow.
// We inform the user it's controlled by the OS and ask them to confirm.
export function ProximityTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const test = TEST_REGISTRY.find(t => t.id === 'proximity')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'proximity');

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={styles.sensorDiagram}>
          <View style={styles.phoneTop}>
            <View style={styles.sensorDot} />
            <Text style={styles.sensorLabel}>Proximity Sensor</Text>
          </View>
          <Text style={styles.arrowLabel}>↑ Cover this area with your palm</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to test</Text>
          <Text style={styles.infoBody}>
            1. Open the Phone app and call any number (e.g. voicemail)
          </Text>
          <Text style={styles.infoBody}>
            2. Hold the phone to your ear — the screen should go black
          </Text>
          <Text style={styles.infoBody}>
            3. Pull it away — screen should come back immediately
          </Text>
        </View>
        <View style={styles.note}>
          <Text style={styles.noteText}>
            ⓘ  The proximity sensor is managed by iOS and not directly readable by third-party apps. This is a guided confirmation test.
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg },
  sensorDiagram: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: colors.border },
  phoneTop: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 2, borderColor: colors.accent },
  sensorDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent },
  sensorLabel: { ...typography.caption, color: colors.accent, fontWeight: '600' as const, textAlign: 'center' },
  arrowLabel: { ...typography.subheadline, color: colors.textSecondary },
  infoCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  infoTitle: { ...typography.headline, marginBottom: spacing.xs },
  infoBody: { ...typography.callout, lineHeight: 22 },
  note: { backgroundColor: colors.surfaceElevated, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  noteText: { ...typography.footnote, color: colors.textSecondary, lineHeight: 18 },
});
