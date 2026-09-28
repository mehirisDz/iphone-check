import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

export function MuteSwitchTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [ringConfirmed, setRingConfirmed] = useState(false);
  const [silentConfirmed, setSilentConfirmed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const test = TEST_REGISTRY.find(t => t.id === 'mute-switch')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'mute-switch');

  const handleRing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setRingConfirmed(true);
    if (silentConfirmed) {
      setTimeout(() => setShowSuccess(true), 600);
    }
  };

  const handleSilent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setSilentConfirmed(true);
    if (ringConfirmed) {
      setTimeout(() => setShowSuccess(true), 600);
    }
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
        {/* Apple Mute / Action Switch Card */}
        <GlassView intensity={40} style={styles.heroCard}>
          <View style={styles.switchGraphic}>
            <View
              style={[
                styles.switchThumb,
                silentConfirmed && styles.switchThumbSilent,
              ]}
            >
              <View
                style={[
                  styles.orangeAccent,
                  silentConfirmed && styles.orangeAccentVisible,
                ]}
              />
            </View>
          </View>
          <Text style={styles.switchTitle}>Ring / Silent Switch</Text>
          <Text style={styles.switchSubtitle}>
            Toggle the physical switch or Action Button on side of device
          </Text>
        </GlassView>

        {/* Verification Toggles */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.tileWrapper}
            onPress={handleRing}
            activeOpacity={0.8}
          >
            <GlassView
              intensity={ringConfirmed ? 50 : 25}
              style={[styles.tile, ringConfirmed && styles.tileActive]}
            >
              <Ionicons
                name="notifications-outline"
                size={28}
                color={ringConfirmed ? colors.systemGreen : '#FFFFFF'}
              />
              <Text style={styles.tileTitle}>Ring Mode</Text>
              <Text style={styles.tileSub}>Confirmed</Text>
            </GlassView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tileWrapper}
            onPress={handleSilent}
            activeOpacity={0.8}
          >
            <GlassView
              intensity={silentConfirmed ? 50 : 25}
              style={[styles.tile, silentConfirmed && styles.tileActive]}
            >
              <Ionicons
                name="notifications-off-outline"
                size={28}
                color={silentConfirmed ? colors.systemOrange : '#FFFFFF'}
              />
              <Text style={styles.tileTitle}>Silent Mode</Text>
              <Text style={styles.tileSub}>Confirmed</Text>
            </GlassView>
          </TouchableOpacity>
        </View>

        <GlassView intensity={25} style={styles.statusGlass}>
          <Text style={styles.statusText}>
            Confirm physical toggle moves cleanly and registers both positions
          </Text>
        </GlassView>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="Ring / Silent Switch Confirmed"
        onFinish={onPass}
      />
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
  switchGraphic: {
    width: 72,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 3,
    marginBottom: spacing.xs,
  },
  switchThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchThumbSilent: {
    transform: [{ translateX: 34 }],
  },
  orangeAccent: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  orangeAccentVisible: {
    backgroundColor: colors.systemOrange,
  },
  switchTitle: {
    ...typography.title2,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  switchSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tileWrapper: {
    flex: 1,
  },
  tile: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    alignItems: 'center',
    gap: 4,
  },
  tileActive: {
    borderColor: 'rgba(48, 209, 88, 0.35)',
    backgroundColor: 'rgba(48, 209, 88, 0.08)',
  },
  tileTitle: {
    ...typography.headline,
    color: '#FFFFFF',
    fontSize: 15,
    marginTop: 4,
  },
  tileSub: {
    ...typography.caption,
    color: colors.textTertiary,
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
    textAlign: 'center',
  },
});
