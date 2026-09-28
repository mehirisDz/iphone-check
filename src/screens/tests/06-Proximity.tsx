import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';

export function ProximityTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const test = TEST_REGISTRY.find(t => t.id === 'proximity')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'proximity');

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
        {/* Dynamic Island Sensor Schematic */}
        <GlassView intensity={40} style={styles.schematicCard}>
          <View style={styles.phoneHead}>
            <View style={styles.dynamicIsland}>
              <View style={styles.cameraLens} />
              <View style={styles.proximitySensor} />
            </View>
          </View>
          <View style={styles.waveIndicators}>
            <Ionicons name="radio-outline" size={24} color={colors.systemGreen} />
            <Text style={styles.sensorBadge}>IR Proximity Emitter</Text>
          </View>
        </GlassView>

        {/* Verification Steps Card */}
        <GlassView intensity={30} style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Verification Procedure</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepBullet}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Place your palm directly over the top earpiece / Dynamic Island.
            </Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepBullet}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Or place a quick call in Phone app to confirm the display shuts off when held to ear.
            </Text>
          </View>
        </GlassView>

        <GlassView intensity={25} style={styles.noticeCard}>
          <Ionicons name="shield-outline" size={16} color={colors.textTertiary} />
          <Text style={styles.noticeText}>
            iOS restricts direct IR proximity raw event polling to active telephony sessions.
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
  schematicCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: radius.xl,
    gap: spacing.md,
  },
  phoneHead: {
    width: 140,
    height: 70,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    paddingTop: 12,
  },
  dynamicIsland: {
    width: 68,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  proximitySensor: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.systemGreen,
  },
  waveIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sensorBadge: {
    ...typography.caption,
    color: colors.systemGreen,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
  },
  instructionsCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  instructionsTitle: {
    ...typography.footnote,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  stepText: {
    ...typography.callout,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  noticeText: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
    lineHeight: 16,
  },
});
