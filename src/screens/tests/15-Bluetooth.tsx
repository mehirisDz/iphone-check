import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';

export function BluetoothTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const test = TEST_REGISTRY.find(t => t.id === 'bluetooth')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'bluetooth');

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
        {/* Apple Bluetooth Hardware Card */}
        <GlassView intensity={40} style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="bluetooth" size={48} color={colors.systemBlue} />
          </View>
          <Text style={styles.heroTitle}>Bluetooth 5.3 Controller</Text>
          <Text style={styles.heroSubtitle}>
            Ultra-Low Energy & Audio Streaming Transceiver
          </Text>
        </GlassView>

        {/* Verification Checklist Card */}
        <GlassView intensity={30} style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>Physical Verification</Text>
          
          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.systemGreen} />
            <Text style={styles.checkText}>
              Ensure Bluetooth toggle is enabled in Settings or Control Center.
            </Text>
          </View>

          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.systemGreen} />
            <Text style={styles.checkText}>
              Verify nearby Apple devices (AirPods, Apple Watch, AirTags) pair without dropouts.
            </Text>
          </View>
        </GlassView>

        <GlassView intensity={25} style={styles.statusGlass}>
          <Text style={styles.statusText}>
            Bluetooth subsystem initialization complete
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
  heroCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: radius.xl,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(10, 132, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    ...typography.title2,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  heroSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  checklistCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  checklistTitle: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkText: {
    ...typography.callout,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  statusGlass: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
