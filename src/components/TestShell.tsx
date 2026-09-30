import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const progress = (stepIndex + 1) / total;

  // Pulsing dot animation for auto-detect tests
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (autoResult) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.7, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    }
    return () => pulseAnim.setValue(1);
  }, [autoResult]);

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
    <View style={[styles.safe, { paddingTop: insets.top || 20 }]}>
      {/* Top Ambient Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        {/* Glow pulse at tip */}
        <View style={[styles.progressGlow, { left: `${progress * 100}%` as any }]} />
      </View>

      {/* Header: Capsule + Skip */}
      <View style={styles.header}>
        <GlassView intensity={40} style={styles.capsule}>
          <Text style={styles.capsuleStep}>{stepIndex + 1} of {total}</Text>
          <View style={styles.capsuleDot} />
          <Text style={styles.capsuleCategory}>{test.category}</Text>
        </GlassView>

        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <Text style={styles.skipBtn}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Title + Apple Icon */}
      <View style={styles.titleArea}>
        <AppleIcon
          name={test.iconName}
          size={28}
          badgeSize={52}
          badgeColor="rgba(255, 255, 255, 0.08)"
        />
        <View style={styles.titleTextContainer}>
          <Text style={styles.title}>{test.title}</Text>
          <Text style={styles.subtitle}>{test.subtitle}</Text>
        </View>
      </View>

      {/* Test Content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom Controls */}
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom + spacing.md, spacing.xl) }]}>
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
            <Animated.View style={[styles.pulsingIndicatorOuter, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.pulsingIndicator} />
            <Text style={styles.autoHintText}>Live Hardware Inspection · Auto-Detecting</Text>
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
    </View>
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
  },
  progressGlow: {
    position: 'absolute',
    top: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.systemGreen,
    shadowColor: colors.systemGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
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
    position: 'relative',
  },
  pulsingIndicatorOuter: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(48, 209, 88, 0.3)',
  },
  pulsingIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.systemGreen,
  },
  autoHintText: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
});
