import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

export function MuteSwitchTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [ringConfirmed, setRingConfirmed] = useState(false);
  const [silentConfirmed, setSilentConfirmed] = useState(false);
  const test = TEST_REGISTRY.find(t => t.id === 'mute-switch')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'mute-switch');

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={styles.phoneOutline}>
          {/* Mute switch */}
          <View style={[styles.switchZone, (ringConfirmed || silentConfirmed) && styles.switchActive]}>
            <View style={[styles.switchToggle, silentConfirmed && styles.switchToggleSilent]} />
          </View>
          <View style={styles.screenArea}>
            <Text style={styles.phoneLabel}>iPhone</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Test the Ring / Silent switch</Text>
          <Text style={styles.step}>
            The switch is on the left side of the iPhone, above the volume buttons.
          </Text>
        </View>

        <View style={styles.confirmRow}>
          <TouchableOpacity
            style={[styles.confirmBtn, ringConfirmed && styles.confirmBtnDone]}
            onPress={() => setRingConfirmed(true)}
          >
            <Text style={styles.confirmIcon}>{ringConfirmed ? '✓' : '🔔'}</Text>
            <Text style={[styles.confirmLabel, ringConfirmed && styles.confirmLabelDone]}>
              Ring mode works
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmBtn, silentConfirmed && styles.confirmBtnDone]}
            onPress={() => setSilentConfirmed(true)}
          >
            <Text style={styles.confirmIcon}>{silentConfirmed ? '✓' : '🔕'}</Text>
            <Text style={[styles.confirmLabel, silentConfirmed && styles.confirmLabelDone]}>
              Silent mode works
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.statusBox, {
          backgroundColor: ringConfirmed && silentConfirmed ? colors.passDim : colors.surface,
          borderColor: ringConfirmed && silentConfirmed ? colors.pass : colors.border,
        }]}>
          <Text style={[styles.statusText, { color: ringConfirmed && silentConfirmed ? colors.pass : colors.textSecondary }]}>
            {ringConfirmed && silentConfirmed
              ? '✓ Both modes confirmed — tap Pass'
              : 'Toggle the switch between Ring ↔ Silent and confirm each mode'}
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg, alignItems: 'center' },
  phoneOutline: { width: 160, height: 240, borderRadius: radius.xxl, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  switchZone: { position: 'absolute', left: -36, top: 30, width: 28, height: 44, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'flex-start', padding: 3 },
  switchActive: { borderColor: colors.accent },
  switchToggle: { width: '100%', height: '45%', borderRadius: 4, backgroundColor: colors.textTertiary },
  switchToggleSilent: { backgroundColor: colors.accent, marginTop: 'auto' },
  screenArea: { width: '70%', height: '60%', borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  phoneLabel: { ...typography.footnote, color: colors.textTertiary },
  infoCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.border, width: '100%' },
  infoTitle: { ...typography.headline },
  step: { ...typography.callout, lineHeight: 22 },
  confirmRow: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
  confirmBtn: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.border },
  confirmBtnDone: { backgroundColor: colors.passDim, borderColor: colors.pass },
  confirmIcon: { fontSize: 24 },
  confirmLabel: { ...typography.footnote, color: colors.textSecondary, fontWeight: '600' as const, textAlign: 'center' },
  confirmLabelDone: { color: colors.pass },
  statusBox: { width: '100%', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.callout, textAlign: 'center', lineHeight: 22 },
});
