import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { TEST_REGISTRY } from '../tests/registry';
import { TestCategory } from '../types';

interface Props {
  onStart: () => void;
}

const CATEGORY_ICONS: Record<TestCategory, string> = {
  'Screen & Touch': '📱',
  'Motion & Sensors': '🧭',
  Camera: '📷',
  Audio: '🎵',
  Biometrics: '🔐',
  Connectivity: '📡',
  Hardware: '⚙️',
};

const CATEGORIES = Array.from(new Set(TEST_REGISTRY.map((t) => t.category))) as TestCategory[];

export function WelcomeScreen({ onStart }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconRing}>
            <Text style={styles.heroIcon}>📱</Text>
          </View>
          <Text style={styles.headline}>iPhone Check</Text>
          <Text style={styles.tagline}>
            A 20-step hardware inspection for used iPhones.
            Run every test live before you buy.
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>20</Text>
            <Text style={styles.statLabel}>Tests</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>~5</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>On-Device</Text>
          </View>
        </View>

        {/* Category list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Tested</Text>
          {CATEGORIES.map((cat) => {
            const count = TEST_REGISTRY.filter((t) => t.category === cat).length;
            return (
              <View key={cat} style={styles.categoryRow}>
                <View style={styles.catIconBg}>
                  <Text style={styles.catIcon}>{CATEGORY_ICONS[cat]}</Text>
                </View>
                <Text style={styles.catName}>{cat}</Text>
                <View style={styles.catBadge}>
                  <Text style={styles.catCount}>{count}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️  Results are a real-time snapshot. Always inspect in person. Not a substitute for professional evaluation.
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={onStart} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Start Inspection</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  iconRing: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.accent },
  heroIcon: { fontSize: 48 },
  headline: { ...typography.largeTitle, marginBottom: spacing.md },
  tagline: { ...typography.callout, textAlign: 'center', lineHeight: 24, paddingHorizontal: spacing.md },
  statsRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.xl, alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: spacing.xs },
  statValue: { ...typography.title2, color: colors.accent },
  statLabel: { ...typography.footnote, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.footnote, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700' as const, marginBottom: spacing.md },
  categoryRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md, borderWidth: 1, borderColor: colors.border },
  catIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center' },
  catIcon: { fontSize: 20 },
  catName: { ...typography.headline, flex: 1 },
  catBadge: { backgroundColor: colors.accentDim, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  catCount: { ...typography.footnote, color: colors.accent, fontWeight: '700' as const },
  disclaimer: { backgroundColor: colors.surfaceElevated, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  disclaimerText: { ...typography.footnote, color: colors.textSecondary, lineHeight: 18 },
  cta: { backgroundColor: colors.accent, paddingVertical: 20, borderRadius: radius.pill, alignItems: 'center', marginBottom: spacing.md },
  ctaText: { ...typography.headline, color: colors.background, fontWeight: '700' as const, fontSize: 18 },
});
