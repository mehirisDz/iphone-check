import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

export function PowerButtonTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [lockDetected, setLockDetected] = useState(false);
  const [unlockDetected, setUnlockDetected] = useState(false);
  const appStateRef = useRef(AppState.currentState);
  const wasBackgroundRef = useRef(false);
  const test = TEST_REGISTRY.find(t => t.id === 'power-button')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'power-button');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // Went to background/inactive = screen locked
      if (appStateRef.current === 'active' && (nextAppState === 'background' || nextAppState === 'inactive')) {
        setLockDetected(true);
        wasBackgroundRef.current = true;
      }

      // Came back to active from background = unlocked
      if (wasBackgroundRef.current && nextAppState === 'active') {
        setUnlockDetected(true);
        wasBackgroundRef.current = false;
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (lockDetected && unlockDetected) {
      setTimeout(() => onPass(), 600);
    }
  }, [lockDetected, unlockDetected, onPass]);

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={styles.phoneOutline}>
          {/* Power button */}
          <View style={[styles.powerBtn, (lockDetected || unlockDetected) && styles.powerBtnActive]}>
            <Text style={styles.powerIcon}>⏻</Text>
          </View>
          <View style={styles.screenArea}>
            <Text style={styles.phoneLabel}>iPhone</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Test the Side / Power Button</Text>
          <Text style={styles.step}>1. Press the <Text style={styles.bold}>side button</Text> to lock the screen</Text>
          <Text style={styles.step}>2. Wait a moment, then unlock the phone</Text>
          <Text style={styles.step}>3. Return to this app — both steps will auto-detect</Text>
        </View>

        <View style={styles.checkRow}>
          <View style={[styles.checkItem, lockDetected && styles.checkItemDone]}>
            <Text style={styles.checkIcon}>{lockDetected ? '✓' : '○'}</Text>
            <Text style={[styles.checkLabel, lockDetected && styles.checkLabelDone]}>Screen Locked</Text>
          </View>
          <View style={[styles.checkItem, unlockDetected && styles.checkItemDone]}>
            <Text style={styles.checkIcon}>{unlockDetected ? '✓' : '○'}</Text>
            <Text style={[styles.checkLabel, unlockDetected && styles.checkLabelDone]}>Screen Unlocked</Text>
          </View>
        </View>

        <View style={[styles.statusBox, {
          backgroundColor: lockDetected && unlockDetected ? colors.passDim : colors.surface,
          borderColor: lockDetected && unlockDetected ? colors.pass : colors.border,
        }]}>
          <Text style={[styles.statusText, { color: lockDetected && unlockDetected ? colors.pass : colors.textSecondary }]}>
            {lockDetected && unlockDetected
              ? '✓ Power button works — auto-passing!'
              : lockDetected
                ? 'Lock detected! Now unlock to complete.'
                : 'Press the side button to lock the screen…'}
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg, alignItems: 'center' },
  phoneOutline: { width: 160, height: 240, borderRadius: radius.xxl, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  powerBtn: { position: 'absolute', right: -36, top: 50, width: 28, height: 52, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  powerBtnActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  powerIcon: { fontSize: 14, color: colors.textTertiary },
  screenArea: { width: '70%', height: '60%', borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  phoneLabel: { ...typography.footnote, color: colors.textTertiary },
  infoCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.border, width: '100%' },
  infoTitle: { ...typography.headline },
  step: { ...typography.callout, lineHeight: 24 },
  bold: { fontWeight: '700' as const, color: colors.accent },
  checkRow: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
  checkItem: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.border },
  checkItemDone: { backgroundColor: colors.passDim, borderColor: colors.pass },
  checkIcon: { fontSize: 24, color: colors.textSecondary },
  checkLabel: { ...typography.footnote, color: colors.textSecondary, fontWeight: '600' as const },
  checkLabelDone: { color: colors.pass },
  statusBox: { width: '100%', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.callout, textAlign: 'center', lineHeight: 22 },
});
