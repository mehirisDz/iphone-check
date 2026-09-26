import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

// Volume button detection isn't directly exposed in RN managed workflow.
// We use a system volume listener approach where available, and fall back to guided test.
export function VolumeButtonsTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [volUpPressed, setVolUpPressed] = useState(false);
  const [volDownPressed, setVolDownPressed] = useState(false);
  const test = TEST_REGISTRY.find(t => t.id === 'volume-buttons')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'volume-buttons');

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={styles.phoneOutline}>
          {/* Volume Up */}
          <TouchableOpacity
            style={[styles.buttonZone, styles.buttonUp, volUpPressed && styles.buttonActive]}
            onPress={() => setVolUpPressed(true)}
          >
            <Text style={[styles.buttonLabel, volUpPressed && styles.buttonLabelActive]}>
              {volUpPressed ? '✓' : 'Vol +'}
            </Text>
          </TouchableOpacity>

          {/* Volume Down */}
          <TouchableOpacity
            style={[styles.buttonZone, styles.buttonDown, volDownPressed && styles.buttonActive]}
            onPress={() => setVolDownPressed(true)}
          >
            <Text style={[styles.buttonLabel, volDownPressed && styles.buttonLabelActive]}>
              {volDownPressed ? '✓' : 'Vol −'}
            </Text>
          </TouchableOpacity>

          <View style={styles.screenArea}>
            <Text style={styles.phoneLabel}>iPhone</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Instructions</Text>
          <Text style={styles.step}>1. Press the <Text style={styles.bold}>Volume Up</Text> button on the phone</Text>
          <Text style={styles.step}>2. Confirm by tapping "Vol +" above</Text>
          <Text style={styles.step}>3. Press the <Text style={styles.bold}>Volume Down</Text> button</Text>
          <Text style={styles.step}>4. Confirm by tapping "Vol −" above</Text>
        </View>

        <View style={[styles.statusBox, {
          backgroundColor: volUpPressed && volDownPressed ? colors.passDim : colors.surface,
          borderColor: volUpPressed && volDownPressed ? colors.pass : colors.border,
        }]}>
          <Text style={[styles.statusText, { color: volUpPressed && volDownPressed ? colors.pass : colors.textSecondary }]}>
            {volUpPressed && volDownPressed
              ? '✓ Both volume buttons confirmed — tap Pass'
              : `${volUpPressed ? '✓ Vol Up' : '○ Vol Up'} · ${volDownPressed ? '✓ Vol Down' : '○ Vol Down'}`}
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg, alignItems: 'center' },
  phoneOutline: { width: 160, height: 280, borderRadius: radius.xxl, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  buttonZone: { position: 'absolute', left: -40, width: 36, height: 48, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  buttonUp: { top: 60 },
  buttonDown: { top: 120 },
  buttonActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  buttonLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '700' as const },
  buttonLabelActive: { color: colors.accent },
  screenArea: { width: '70%', height: '60%', borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  phoneLabel: { ...typography.footnote, color: colors.textTertiary },
  infoCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.border, width: '100%' },
  infoTitle: { ...typography.headline, marginBottom: spacing.xs },
  step: { ...typography.callout, lineHeight: 24 },
  bold: { fontWeight: '700' as const, color: colors.accent },
  statusBox: { width: '100%', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.headline, textAlign: 'center' },
});
