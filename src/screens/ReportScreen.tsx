import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../theme';
import { TestResults, TestOutcome } from '../types';
import { TEST_REGISTRY } from '../tests/registry';
import { GlassView } from '../components/GlassView';
import { AppleIcon } from '../components/AppleIcon';

interface Props {
  results: TestResults;
  onRetry: (index: number) => void;
  onReset: () => void;
}

const OUTCOME_CONFIG: Record<
  TestOutcome,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  pass: { label: 'Passed', color: colors.systemGreen, icon: 'checkmark-circle' },
  fail: { label: 'Failed', color: colors.systemRed, icon: 'close-circle' },
  skip: { label: 'Skipped', color: colors.textTertiary, icon: 'remove-circle' },
  pending: { label: 'Not Run', color: colors.textTertiary, icon: 'help-circle' },
};

export function ReportScreen({ results, onRetry, onReset }: Props) {
  const pass = Object.values(results).filter(r => r === 'pass').length;
  const fail = Object.values(results).filter(r => r === 'fail').length;
  const skip = Object.values(results).filter(r => r === 'skip').length;
  const total = TEST_REGISTRY.length;
  const score = total > 0 ? Math.round((pass / total) * 100) : 0;
  const isAllNominal = fail === 0;

  const RING_SIZE = 140;
  const STROKE_WIDTH = 10;
  const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * score) / 100;

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onReset();
  };

  const handleRetryItem = (index: number) => {
    Haptics.selectionAsync().catch(() => {});
    onRetry(index);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Apple Health / Diagnostics Ring Hero */}
        <GlassView intensity={45} style={styles.scoreCard}>
          <View style={styles.ringWrapper}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={isAllNominal ? colors.systemGreen : colors.systemOrange}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              />
            </Svg>
            <View style={styles.ringCenterText}>
              <Text style={styles.scoreText}>{score}%</Text>
              <Text style={styles.scoreSub}>HEALTH</Text>
            </View>
          </View>

          <View style={styles.verdictBox}>
            <Text style={styles.verdictTitle}>
              {isAllNominal ? 'Hardware Fully Operational' : 'Hardware Attention Required'}
            </Text>
            <Text style={styles.verdictSubtitle}>
              {pass} passed · {fail} flagged · {skip} skipped
            </Text>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.summaryBar}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: colors.systemGreen }]}>
                {pass}
              </Text>
              <Text style={styles.summaryLbl}>Passed</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: colors.systemRed }]}>
                {fail}
              </Text>
              <Text style={styles.summaryLbl}>Failed</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{skip}</Text>
              <Text style={styles.summaryLbl}>Skipped</Text>
            </View>
          </View>
        </GlassView>

        {/* Individual Module Results */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Diagnostic Verification Log</Text>
          <View style={styles.testList}>
            {TEST_REGISTRY.map((test, index) => {
              const outcome: TestOutcome = results[test.id] ?? 'pending';
              const config = OUTCOME_CONFIG[outcome];

              return (
                <GlassView key={test.id} intensity={30} style={styles.testRow}>
                  <AppleIcon
                    name={test.iconName}
                    size={20}
                    badgeSize={40}
                    badgeColor="rgba(255, 255, 255, 0.06)"
                  />
                  <View style={styles.testMeta}>
                    <Text style={styles.testTitle}>{test.title}</Text>
                    <Text style={styles.testCategory}>{test.category}</Text>
                  </View>

                  <View style={styles.testAction}>
                    <View
                      style={[
                        styles.outcomeBadge,
                        { borderColor: config.color },
                      ]}
                    >
                      <Ionicons
                        name={config.icon}
                        size={14}
                        color={config.color}
                      />
                      <Text
                        style={[styles.outcomeText, { color: config.color }]}
                      >
                        {config.label}
                      </Text>
                    </View>

                    {outcome !== 'pass' && (
                      <TouchableOpacity
                        onPress={() => handleRetryItem(index)}
                        style={styles.retryPill}
                      >
                        <Text style={styles.retryPillText}>Retest</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </GlassView>
              );
            })}
          </View>
        </View>

        {/* Start Fresh Scan Action */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleReset}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
          <Text style={styles.resetBtnText}>Start New Inspection</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  scoreCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: radius.xl,
    gap: spacing.lg,
  },
  ringWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenterText: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    ...typography.metricMd,
    color: '#FFFFFF',
    fontWeight: '800' as const,
  },
  scoreSub: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700' as const,
  },
  verdictBox: {
    alignItems: 'center',
    gap: 4,
  },
  verdictTitle: {
    ...typography.headline,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  verdictSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryNum: {
    ...typography.title2,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  summaryLbl: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.xs,
  },
  testList: {
    gap: spacing.sm,
  },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  testMeta: {
    flex: 1,
    gap: 2,
  },
  testTitle: {
    ...typography.subheadline,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  testCategory: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  testAction: {
    alignItems: 'flex-end',
    gap: 6,
  },
  outcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  outcomeText: {
    ...typography.caption,
    fontWeight: '600' as const,
    fontSize: 11,
  },
  retryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  retryPillText: {
    ...typography.caption,
    color: colors.systemBlue,
    fontWeight: '600' as const,
    fontSize: 11,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    gap: spacing.sm,
  },
  resetBtnText: {
    ...typography.headline,
    color: '#FFFFFF',
  },
});
