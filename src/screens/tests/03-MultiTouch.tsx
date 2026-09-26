import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, PanResponder } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

export function MultiTouchTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [touchCount, setTouchCount] = useState(0);
  const [maxTouches, setMaxTouches] = useState(0);
  const test = TEST_REGISTRY.find(t => t.id === 'multi-touch')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'multi-touch');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const n = evt.nativeEvent.touches.length;
        setTouchCount(n);
        setMaxTouches(prev => Math.max(prev, n));
      },
      onPanResponderMove: (evt) => {
        const n = evt.nativeEvent.touches.length;
        setTouchCount(n);
        setMaxTouches(prev => Math.max(prev, n));
      },
      onPanResponderRelease: () => setTouchCount(0),
      onPanResponderTerminate: () => setTouchCount(0),
    })
  ).current;

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.arena} {...panResponder.panHandlers}>
        <Text style={styles.bigNum}>{touchCount}</Text>
        <Text style={styles.bigLabel}>fingers</Text>
        <View style={styles.maxRow}>
          <Text style={styles.maxLabel}>Max simultaneous: </Text>
          <Text style={styles.maxVal}>{maxTouches}</Text>
        </View>
        <Text style={styles.hint}>Place multiple fingers anywhere in this area</Text>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  arena: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border },
  bigNum: { fontSize: 96, fontWeight: '800' as const, color: colors.accent, letterSpacing: -4 },
  bigLabel: { ...typography.headline, color: colors.textSecondary, marginTop: -spacing.md },
  maxRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  maxLabel: { ...typography.callout },
  maxVal: { ...typography.title3, color: colors.accent, fontWeight: '700' as const },
  hint: { ...typography.footnote, color: colors.textTertiary, position: 'absolute', bottom: spacing.lg },
});
