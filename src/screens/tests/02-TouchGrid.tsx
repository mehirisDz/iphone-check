import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

const ROWS = 5;
const COLS = 4;
const TOTAL = ROWS * COLS;

export function TouchGridTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const test = TEST_REGISTRY.find(t => t.id === 'touch-grid')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'touch-grid');
  const allTapped = tapped.size === TOTAL;

  const handleTap = (i: number) => {
    setTapped(prev => { const n = new Set(prev); n.add(i); return n; });
  };

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip} autoResult={false}>
      <View style={styles.meta}>
        <Text style={styles.progress}>{tapped.size} / {TOTAL} zones tapped</Text>
        {allTapped && <Text style={styles.done}>All zones responsive!</Text>}
      </View>
      <View style={styles.grid}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.cell, tapped.has(i) && styles.cellTapped]}
            onPress={() => handleTap(i)}
            activeOpacity={0.6}
          >
            {tapped.has(i) && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  meta: { marginBottom: spacing.md },
  progress: { ...typography.headline, color: colors.accent, marginBottom: spacing.xs },
  done: { ...typography.subheadline, color: colors.pass },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  cell: { width: '22%', aspectRatio: 1, backgroundColor: colors.surface, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  cellTapped: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  check: { color: colors.accent, fontSize: 20, fontWeight: '700' as const },
});
