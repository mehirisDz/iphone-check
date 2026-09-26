import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

// Bluetooth scanning requires native modules not available in Expo Go managed workflow.
// This is a guided confirmation test.
export function BluetoothTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const test = TEST_REGISTRY.find(t => t.id === 'bluetooth')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'bluetooth');

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={styles.iconRing}>
          <Text style={styles.icon}>🔵</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to test Bluetooth</Text>
          <Text style={styles.step}>1. Open Settings → Bluetooth</Text>
          <Text style={styles.step}>2. Toggle Bluetooth ON if not already</Text>
          <Text style={styles.step}>3. Verify "My Devices" or "Other Devices" list appears</Text>
          <Text style={styles.step}>4. Try connecting to a nearby Bluetooth device (headphones, speaker, car)</Text>
        </View>

        <View style={styles.altCard}>
          <Text style={styles.altTitle}>Quick alternative</Text>
          <Text style={styles.altBody}>
            Open Control Center (swipe down from top-right). If the Bluetooth icon is available and toggles blue, the radio is functioning.
          </Text>
        </View>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            ⓘ  Bluetooth Low Energy scanning requires native code not available in Expo Go. This guided test confirms the radio hardware works via the system UI.
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg },
  iconRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accentBlueDim, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 2, borderColor: colors.accentBlue },
  icon: { fontSize: 36 },
  infoCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  infoTitle: { ...typography.headline, marginBottom: spacing.xs },
  step: { ...typography.callout, lineHeight: 24 },
  altCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  altTitle: { ...typography.headline, color: colors.accent },
  altBody: { ...typography.callout, lineHeight: 22 },
  note: { backgroundColor: colors.surfaceElevated, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  noteText: { ...typography.footnote, color: colors.textSecondary, lineHeight: 18 },
});
