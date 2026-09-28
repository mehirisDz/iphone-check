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
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../theme';
import { TEST_REGISTRY } from '../tests/registry';
import { TestCategory } from '../types';
import { GlassView } from '../components/GlassView';
import { AppleIcon } from '../components/AppleIcon';

interface Props {
  onStart: () => void;
}

const CATEGORY_ICONS: Record<TestCategory, keyof typeof Ionicons.glyphMap> = {
  'Screen & Touch': 'color-palette-outline',
  'Motion & Sensors': 'compass-outline',
  Camera: 'camera-outline',
  Audio: 'volume-high-outline',
  Biometrics: 'scan-outline',
  Connectivity: 'wifi-outline',
  Hardware: 'hardware-chip-outline',
};

const CATEGORIES = Array.from(new Set(TEST_REGISTRY.map(t => t.category))) as TestCategory[];

export function WelcomeScreen({ onStart }: Props) {
  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    onStart();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Apple Device Diagnostics Hero Card */}
        <GlassView intensity={45} style={styles.heroCard}>
          <AppleIcon
            name="shield-checkmark-outline"
            size={32}
            badgeSize={64}
            badgeColor="rgba(48, 209, 88, 0.12)"
          />
          <View style={styles.heroText}>
            <Text style={styles.title}>iPhone Check</Text>
            <Text style={styles.subtitle}>
              Apple Hardware Diagnostic Suite
            </Text>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>20</Text>
              <Text style={styles.metricLabel}>Modules</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>~3</Text>
              <Text style={styles.metricLabel}>Minutes</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>100%</Text>
              <Text style={styles.metricLabel}>On-Device</Text>
            </View>
          </View>
        </GlassView>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Hardware Modules</Text>
          <View style={styles.categoryList}>
            {CATEGORIES.map(cat => {
              const count = TEST_REGISTRY.filter(t => t.category === cat).length;
              const iconName = CATEGORY_ICONS[cat];

              return (
                <GlassView key={cat} intensity={30} style={styles.categoryCard}>
                  <AppleIcon
                    name={iconName}
                    size={20}
                    badgeSize={40}
                    badgeColor="rgba(255, 255, 255, 0.06)"
                  />
                  <Text style={styles.categoryName}>{cat}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count} tests</Text>
                  </View>
                </GlassView>
              );
            })}
          </View>
        </View>

        {/* Privacy & Hardware Disclosure */}
        <GlassView intensity={25} style={styles.disclaimerCard}>
          <Ionicons
            name="lock-closed-outline"
            size={16}
            color={colors.textTertiary}
          />
          <Text style={styles.disclaimerText}>
            All sensor and hardware benchmarks execute strictly on-device in real-time. No telemetry or diagnostics data is transmitted.
          </Text>
        </GlassView>

        {/* Start Full Inspection Primary Button */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>Start Full Inspection</Text>
          <Ionicons name="arrow-forward" size={20} color="#000000" />
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
  heroCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: radius.xl,
    gap: spacing.lg,
  },
  heroText: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    ...typography.largeTitle,
    color: '#FFFFFF',
    fontWeight: '800' as const,
  },
  subtitle: {
    ...typography.callout,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    ...typography.title2,
    color: colors.systemGreen,
    fontWeight: '800' as const,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricDivider: {
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
  categoryList: {
    gap: spacing.sm,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  categoryName: {
    ...typography.headline,
    flex: 1,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  countText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600' as const,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
    lineHeight: 16,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.systemGreen,
    paddingVertical: 18,
    borderRadius: radius.pill,
    gap: spacing.sm,
    shadowColor: colors.systemGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  startBtnText: {
    ...typography.headline,
    color: '#000000',
    fontWeight: '700' as const,
    fontSize: 17,
  },
});
