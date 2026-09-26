import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

const COLORS = ['#FF3B30','#FF9F0A','#FFD60A','#34C759','#00C7BE','#007AFF','#5856D6','#FFFFFF','#000000'];
const COLOR_LABELS = ['Red','Orange','Yellow','Green','Teal','Blue','Purple','White','Black'];

export function ColorSweepTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [colorIdx, setColorIdx] = useState(0);
  const test = TEST_REGISTRY.find(t => t.id === 'color-sweep')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'color-sweep');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: COLORS[colorIdx] }]}>
      <StatusBar barStyle={colorIdx >= 7 ? 'dark-content' : 'light-content'} backgroundColor={COLORS[colorIdx]} />
      <View style={styles.overlay}>
        <Text style={[styles.colorLabel, { color: colorIdx === 8 ? '#FFF' : '#000', opacity: 0.5 }]}>
          {COLOR_LABELS[colorIdx]}
        </Text>
        <Text style={[styles.hint, { color: colorIdx === 8 ? '#FFF' : '#000', opacity: 0.4 }]}>
          Look for dead pixels, stuck colors, or dark patches
        </Text>
        <View style={styles.dotsRow}>
          {COLORS.map((c, i) => (
            <TouchableOpacity key={i} onPress={() => setColorIdx(i)} style={[styles.dot, { backgroundColor: c, borderWidth: i === colorIdx ? 3 : 0, borderColor: colorIdx === 8 ? '#FFF' : '#000' }]} />
          ))}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnPass]} onPress={onPass}>
            <Text style={styles.btnPassText}>Display Looks Good</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnFail]} onPress={onFail}>
            <Text style={styles.btnFailText}>Found Issues</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip}>
            <Text style={[styles.skipText, { color: colorIdx === 8 ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }]}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  colorLabel: { fontSize: 24, fontWeight: '700' as const, letterSpacing: 2, textTransform: 'uppercase' },
  hint: { fontSize: 14, textAlign: 'center', maxWidth: 280 },
  dotsRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  dot: { width: 28, height: 28, borderRadius: 14 },
  actions: { width: '100%', gap: spacing.sm, alignItems: 'center' },
  btn: { width: '100%', paddingVertical: 18, borderRadius: radius.pill, alignItems: 'center' },
  btnPass: { backgroundColor: colors.accent },
  btnPassText: { ...typography.headline, color: colors.background, fontWeight: '700' as const },
  btnFail: { backgroundColor: 'rgba(255,59,48,0.15)', borderWidth: 1, borderColor: colors.fail },
  btnFailText: { ...typography.headline, color: colors.fail },
  skipText: { ...typography.callout, marginTop: spacing.xs },
});
