import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { TestDefinition } from '../types';

interface Props {
  test: TestDefinition;
  stepIndex: number;
  total: number;
  onPass: () => void;
  onFail: () => void;
  onSkip: () => void;
  children: React.ReactNode;
  autoResult?: boolean;
}

export function TestShell({ test, stepIndex, total, onPass, onFail, onSkip, children, autoResult }: Props) {
  const progress = (stepIndex + 1) / total;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>
      <View style={styles.header}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>{stepIndex + 1} / {total}</Text>
        </View>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{test.category}</Text>
        </View>
      </View>
      <View style={styles.titleArea}>
        <Text style={styles.icon}>{test.icon}</Text>
        <Text style={styles.title}>{test.title}</Text>
        <Text style={styles.subtitle}>{test.subtitle}</Text>
      </View>
      <View style={styles.content}>{children}</View>
      <View style={styles.actions}>
        {!autoResult && (
          <>
            <TouchableOpacity style={styles.btnPass} onPress={onPass} activeOpacity={0.8}>
              <Text style={styles.btnPassText}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFail} onPress={onFail} activeOpacity={0.8}>
              <Text style={styles.btnFailText}>Fail</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.btnSkip} onPress={onSkip} activeOpacity={0.8}>
          <Text style={styles.btnSkipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  progressTrack: { height: 3, backgroundColor: colors.surface, width: '100%' },
  progressFill: { height: 3, backgroundColor: colors.accent, borderRadius: radius.pill },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  stepBadge: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  stepText: { ...typography.footnote, color: colors.textSecondary, fontWeight: '600' as const },
  categoryPill: { backgroundColor: colors.accentDim, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  categoryText: { ...typography.footnote, color: colors.accent, fontWeight: '600' as const },
  titleArea: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.xs },
  icon: { fontSize: 36, marginBottom: spacing.xs },
  title: { ...typography.title1 },
  subtitle: { ...typography.callout, lineHeight: 22, marginTop: spacing.xs },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  actions: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, paddingTop: spacing.md, gap: spacing.sm },
  btnPass: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: radius.pill, alignItems: 'center' },
  btnPassText: { ...typography.headline, color: colors.background, fontWeight: '700' as const },
  btnFail: { backgroundColor: colors.failDim, paddingVertical: 18, borderRadius: radius.pill, alignItems: 'center', borderWidth: 1, borderColor: colors.fail },
  btnFailText: { ...typography.headline, color: colors.fail },
  btnSkip: { paddingVertical: spacing.sm, alignItems: 'center' },
  btnSkipText: { ...typography.callout, color: colors.textTertiary },
});
