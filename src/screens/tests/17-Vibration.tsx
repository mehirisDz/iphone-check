import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';

interface HapticMode {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  trigger: () => void;
}

const MODES: HapticMode[] = [
  {
    id: 'light',
    label: 'Light Impact',
    icon: 'ellipse-outline',
    trigger: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  },
  {
    id: 'medium',
    label: 'Medium Impact',
    icon: 'disc-outline',
    trigger: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  },
  {
    id: 'heavy',
    label: 'Heavy Impact',
    icon: 'hardware-chip-outline',
    trigger: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  },
  {
    id: 'success',
    label: 'Success Notification',
    icon: 'checkmark-circle-outline',
    trigger: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  },
  {
    id: 'warning',
    label: 'Warning Pattern',
    icon: 'alert-circle-outline',
    trigger: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  },
  {
    id: 'rigid',
    label: 'Rigid Pulse',
    icon: 'flash-outline',
    trigger: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid),
  },
];

export function VibrationTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  const test = TEST_REGISTRY.find(t => t.id === 'vibration')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'vibration');

  const handlePress = (mode: HapticMode) => {
    setActiveId(mode.id);
    mode.trigger();
    setTested(prev => new Set(prev).add(mode.id));
    setTimeout(() => setActiveId(null), 350);
  };

  return (
    <TestShell
      test={test}
      stepIndex={stepIndex}
      total={TEST_REGISTRY.length}
      onPass={onPass}
      onFail={onFail}
      onSkip={onSkip}
    >
      <View style={styles.container}>
        <Text style={styles.sectionHeader}>
          Tap each module to trigger Apple Taptic Engine ({tested.size} / {MODES.length})
        </Text>

        <View style={styles.grid}>
          {MODES.map(mode => {
            const isTested = tested.has(mode.id);
            const isActive = activeId === mode.id;

            return (
              <TouchableOpacity
                key={mode.id}
                style={styles.cardWrapper}
                onPress={() => handlePress(mode)}
                activeOpacity={0.7}
              >
                <GlassView
                  intensity={isActive ? 65 : 35}
                  style={[
                    styles.card,
                    isTested && styles.cardTested,
                    isActive && styles.cardActive,
                  ]}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      isTested && styles.iconCircleTested,
                      isActive && styles.iconCircleActive,
                    ]}
                  >
                    <Ionicons
                      name={mode.icon}
                      size={24}
                      color={
                        isActive
                          ? colors.systemGreen
                          : isTested
                          ? '#FFFFFF'
                          : colors.textSecondary
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.cardLabel,
                      isTested && styles.cardLabelTested,
                    ]}
                  >
                    {mode.label}
                  </Text>
                </GlassView>
              </TouchableOpacity>
            );
          })}
        </View>

        <GlassView intensity={30} style={styles.instructionGlass}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.systemGreen}
          />
          <Text style={styles.instructionText}>
            Confirm physical motor vibration and haptic sensations feel crisp
          </Text>
        </GlassView>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  cardWrapper: {
    width: '48%',
  },
  card: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.xl,
  },
  cardTested: {
    borderColor: 'rgba(48, 209, 88, 0.35)',
  },
  cardActive: {
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    borderColor: colors.systemGreen,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleTested: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  iconCircleActive: {
    backgroundColor: 'rgba(48, 209, 88, 0.25)',
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  cardLabelTested: {
    color: '#FFFFFF',
  },
  instructionGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  instructionText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});
