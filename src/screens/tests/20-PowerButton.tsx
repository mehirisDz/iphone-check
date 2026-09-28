import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

export function PowerButtonTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [lockedDetected, setLockedDetected] = useState(false);
  const [unlockedDetected, setUnlockedDetected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const passedRef = useRef(false);

  const test = TEST_REGISTRY.find(t => t.id === 'power-button')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'power-button');

  useEffect(() => {
    let hadBackground = false;

    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (nextState === 'background' || nextState === 'inactive') {
          hadBackground = true;
          setLockedDetected(true);
        } else if (nextState === 'active' && hadBackground && !passedRef.current) {
          passedRef.current = true;
          setUnlockedDetected(true);
          setShowSuccess(true);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <TestShell
      test={test}
      stepIndex={stepIndex}
      total={TEST_REGISTRY.length}
      onPass={onPass}
      onFail={onFail}
      onSkip={onSkip}
      autoResult={true}
    >
      <View style={styles.container}>
        {/* Side / Lock Button Hero Card */}
        <GlassView intensity={40} style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="power-outline" size={44} color={colors.systemGreen} />
          </View>
          <Text style={styles.heroTitle}>Side / Sleep Button</Text>
          <Text style={styles.heroSubtitle}>
            Mechanical Power Switch & Lock State Transition
          </Text>
        </GlassView>

        {/* Real-time State Verification Pills */}
        <View style={styles.stateRow}>
          <GlassView
            intensity={lockedDetected ? 50 : 25}
            style={[
              styles.stateTile,
              lockedDetected && styles.stateTileActive,
            ]}
          >
            <Ionicons
              name={lockedDetected ? 'lock-closed' : 'lock-closed-outline'}
              size={22}
              color={lockedDetected ? colors.systemGreen : colors.textTertiary}
            />
            <Text style={styles.stateLabel}>Device Locked</Text>
          </GlassView>

          <GlassView
            intensity={unlockedDetected ? 50 : 25}
            style={[
              styles.stateTile,
              unlockedDetected && styles.stateTileActive,
            ]}
          >
            <Ionicons
              name={unlockedDetected ? 'lock-open' : 'lock-open-outline'}
              size={22}
              color={unlockedDetected ? colors.systemGreen : colors.textTertiary}
            />
            <Text style={styles.stateLabel}>Device Unlocked</Text>
          </GlassView>
        </View>

        <GlassView intensity={25} style={styles.instructionsGlass}>
          <Ionicons
            name="finger-print-outline"
            size={18}
            color={colors.systemGreen}
          />
          <Text style={styles.instructionsText}>
            Click the side button to lock your iPhone, then wake or unlock it. The test will automatically pass.
          </Text>
        </GlassView>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="Side Button Verified"
        onFinish={onPass}
      />
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  heroCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: radius.xl,
    gap: spacing.xs,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(48, 209, 88, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    ...typography.title2,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  heroSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stateRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stateTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  stateTileActive: {
    borderColor: 'rgba(48, 209, 88, 0.35)',
  },
  stateLabel: {
    ...typography.headline,
    color: '#FFFFFF',
    fontSize: 15,
  },
  instructionsGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  instructionsText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
