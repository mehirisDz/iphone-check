import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../theme';
import { TestDefinition } from '../types';
import { AppleIcon } from './AppleIcon';
import { GlassView } from './GlassView';
import { SuccessOverlay } from './SuccessOverlay';

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

export function TestShell({
  test,
  stepIndex,
  total,
  onPass,
  onFail,
  onSkip,
  children,
  autoResult,
}: Props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const progress = (stepIndex + 1) / total;

  const handlePass = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setShowSuccess(true);
  };

  const handleFail = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    onFail();
  };

  const handleSkip = () => {
    Haptics.selectionAsync().catch(() => {});
    onSkip();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Top Ambient Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>

      {/* Dynamic Island Style Header Capsule */}
      <View style={styles.header}>
        <GlassView intensity={40} style={styles.capsule}>
          <Text style={styles.capsuleStep}>
            {stepIndex + 1} of {total}
          </Text>
          <View style={styles.capsuleDot} />
          <Text style={styles.capsuleCategory}>{test.category}</Text>
        </GlassView>

        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.skipBtn}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Screen Title & Apple SF Icon */}
      <View style={styles.titleArea}>
        <AppleIcon name={test.iconName} size={28} badgeSize={52} badgeColor="rgba(255, 255, 255, 0.08)" />
        <View style={styles.titleTextContainer}>
          <Text style={styles.title}>{test.title}</Text>
          <Text style={styles.subtitle}>{test.subtitle}</Text>
        </View>
      </View>

      {/* Interactive Test Content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom Controls */}
      <View style={styles.actions}>
        {!autoResult ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.btn, styles.btnFail]}
              onPress={handleFail}
              activeOpacity={0.75}
            >
              <Text style={styles.btnFailText}>Issue Found</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnPass]}
              onPress={handlePass}
              activeOpacity={0.8}
            >
              <Text style={styles.btnPassText}>Pass</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.autoHintContainer}>
            <View style={styles.pulsingIndicator} />
            <Text style={styles.autoHintText}>Live Hardware Inspection Active</Text>
          </View>
        )}
      </View>

      {/* Apple-style Animated Success HUD */}
      <SuccessOverlay
        visible={showSuccess}
        title={`${test.title} Passed`}
        onFinish={() => {
          setShowSuccess(false);
          onPass();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    width: '100%',
  },
  progressFill: {
    height: 2,
    backgroundColor: colors.systemGreen,
    shadowColor: colors.systemGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    gap: 8,
  },
  capsuleStep: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  capsuleDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  capsuleCategory: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  skipBtn: {
    ...typography.callout,
    color: colors.textTertiary,
    fontWeight: '500' as const,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  titleTextContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.title2,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  btn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPass: {
    backgroundColor: colors.systemGreen,
    shadowColor: colors.systemGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  btnPassText: {
    ...typography.headline,
    color: '#000000',
    fontWeight: '700' as const,
  },
  btnFail: {
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.35)',
  },
  btnFailText: {
    ...typography.headline,
    color: colors.systemRed,
    fontWeight: '600' as const,
  },
  autoHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.sm,
  },
  pulsingIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.systemGreen,
  },
  autoHintText: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 0.2,
  },
});
