import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { TestResults, TestOutcome, TestId } from '../types';
import { TEST_REGISTRY } from '../tests/registry';

interface Props {
  results: TestResults;
  onRetry: (index: number) => void;
  onReset: () => void;
}

const OUTCOME_CONFIG: Record<TestOutcome, { label: string; color: string; bg: string; icon: string }> = {
  pass: { label: 'Pass', color: colors.pass, bg: colors.passDim, icon: '✓' },
  fail: { label: 'Fail', color: colors.fail, bg: colors.failDim, icon: '✗' },
  skip: { label: 'Skip', color: colors.skip, bg: colors.skipDim, icon: '–' },
  pending: { label: 'Not Run', color: colors.textTertiary, bg: colors.surface, icon: '?' },
};

export function ReportScreen({ results, onRetry, onReset }: Props) {
  const pass = Object.values(results).filter((r) => r === 'pass').length;
  const fail = Object.values(results).filter((r) => r === 'fail').length;
  const skip = Object.values(results).filter((r) => r === 'skip').length;
  const total = TEST_REGISTRY.length;
  const score = total > 0 ? Math.round((pass / total) * 100) : 0;
  const overallPass = fail === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Score hero */}
        <View style={styles.hero}>
          <View style={[styles.scoreRing, { borderColor: overallPass ? colors.pass : colors.fail }]}>
            <Text style={[styles.scoreNum, { color: overallPass ? colors.pass : colors.fail }]}>{score}%</Text>
            <Text style={styles.scoreLabel}>Overall Score</Text>
          </View>
          <Text style={[styles.verdict, { color: overallPass ? colors.pass : colors.fail }]}>
            {overallPass ? 'Looking Good' : 'Issues Found'}
          </Text>
          <Text style={styles.verdictSub}>
            {pass} passed · {fail} failed · {skip} skipped
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.passDim }]}>
            <Text style={[styles.statNum, { color: colors.pass }]}>{pass}</Text>
            <Text style={styles.statLbl}>Passed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.failDim }]}>
            <Text style={[styles.statNum, { color: colors.fail }]}>{fail}</Text>
            <Text style={styles.statLbl}>Failed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.skipDim }]}>
            <Text style={[styles.statNum, { color: colors.skip }]}>{skip}</Text>
            <Text style={styles.statLbl}>Skipped</Text>
          </View>
        </View>

        {/* Per-test list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          {TEST_REGISTRY.map((test, index) => {
            const outcome: TestOutcome = results[test.id as TestId] ?? 'pending';
            const cfg = OUTCOME_CONFIG[outcome];
            return (
              <View key={test.id} style={styles.testRow}>
                <View style={[styles.outcomeDot, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.outcomeDotText, { color: cfg.color }]}>{cfg.icon}</Text>
                </View>
                <View style={styles.testInfo}>
                  <Text style={styles.testTitle}>{test.title}</Text>
                  <Text style={styles.testCat}>{test.category}</Text>
                </View>
                <View style={styles.testRight}>
                  <Text style={[styles.outcomeLabel, { color: cfg.color }]}>{cfg.label}</Text>
                  {(outcome === 'fail' || outcome === 'skip' || outcome === 'pending') && (
                    <TouchableOpacity onPress={() => onRetry(index)} style={styles.retryBtn}>
                      <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={onReset} activeOpacity={0.8}>
          <Text style={styles.resetText}>Start New Inspection</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.xl },
  scoreRing: { width: 160, height: 160, borderRadius: 80, borderWidth: 6, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, backgroundColor: colors.surface },
  scoreNum: { fontSize: 52, fontWeight: '800' as const, letterSpacing: -2 },
  scoreLabel: { ...typography.caption, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1 },
  verdict: { ...typography.title1, marginBottom: spacing.xs },
  verdictSub: { ...typography.callout },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  statCard: { flex: 1, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.xs },
  statNum: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -1 },
  statLbl: { ...typography.footnote, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.footnote, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700' as const, marginBottom: spacing.md },
  testRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md, borderWidth: 1, borderColor: colors.border },
  outcomeDot: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  outcomeDotText: { fontWeight: '700' as const, fontSize: 16 },
  testInfo: { flex: 1 },
  testTitle: { ...typography.subheadline, color: colors.textPrimary, fontWeight: '600' as const },
  testCat: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  testRight: { alignItems: 'flex-end', gap: 4 },
  outcomeLabel: { ...typography.footnote, fontWeight: '700' as const },
  retryBtn: { backgroundColor: colors.accentBlueDim, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  retryText: { ...typography.caption, color: colors.accentBlue, fontWeight: '600' as const },
  resetBtn: { backgroundColor: colors.surface, paddingVertical: 18, borderRadius: radius.pill, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  resetText: { ...typography.headline, color: colors.textPrimary },
});
