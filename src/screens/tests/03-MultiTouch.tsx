import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

export function MultiTouchTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [touchCount, setTouchCount] = useState(0);
  const [maxTouches, setMaxTouches] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const passedRef = useRef(false);

  const test = TEST_REGISTRY.find(t => t.id === 'multi-touch')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'multi-touch');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const n = evt.nativeEvent.touches.length;
        setTouchCount(n);
        setMaxTouches(prev => Math.max(prev, n));
        if (n >= 2 && !passedRef.current) {
          passedRef.current = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          setTimeout(() => setShowSuccess(true), 600);
        }
      },
      onPanResponderMove: evt => {
        const n = evt.nativeEvent.touches.length;
        setTouchCount(n);
        setMaxTouches(prev => Math.max(prev, n));
        if (n >= 2 && !passedRef.current) {
          passedRef.current = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          setTimeout(() => setShowSuccess(true), 600);
        }
      },
      onPanResponderRelease: () => setTouchCount(0),
      onPanResponderTerminate: () => setTouchCount(0),
    })
  ).current;

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
        <GlassView
          intensity={35}
          style={styles.arena}
          {...panResponder.panHandlers}
        >
          <View style={styles.radarRing1} />
          <View style={styles.radarRing2} />

          <View style={styles.centerBadge}>
            <Text style={styles.touchNumber}>{touchCount}</Text>
            <Text style={styles.touchLabel}>Active Contact Points</Text>
          </View>

          <GlassView intensity={45} style={styles.pillBadge}>
            <Text style={styles.pillText}>
              Peak Multi-Touch: {maxTouches} Points
            </Text>
          </GlassView>

          <Text style={styles.footerHint}>
            Place 2 or more fingers simultaneously on the glass
          </Text>
        </GlassView>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="Multi-Touch Verified"
        onFinish={onPass}
      />
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  arena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  radarRing1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  radarRing2: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  centerBadge: {
    alignItems: 'center',
    gap: 4,
  },
  touchNumber: {
    fontSize: 90,
    fontWeight: '800' as const,
    color: colors.systemGreen,
    letterSpacing: -4,
  },
  touchLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillBadge: {
    position: 'absolute',
    top: spacing.lg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  pillText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  footerHint: {
    ...typography.caption,
    color: colors.textTertiary,
    position: 'absolute',
    bottom: spacing.lg,
    textAlign: 'center',
  },
});
