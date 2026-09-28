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

export function VolumeButtonsTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [volUp, setVolUp] = useState(false);
  const [volDown, setVolDown] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const test = TEST_REGISTRY.find(t => t.id === 'volume-buttons')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'volume-buttons');

  const handlePressUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setVolUp(true);
    if (volDown) {
      setTimeout(() => setShowSuccess(true), 600);
    }
  };

  const handlePressDown = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setVolDown(true);
    if (volUp) {
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
        {/* Apple iPhone Chassis Schematic */}
        <GlassView intensity={40} style={styles.chassisCard}>
          <View style={styles.phoneBody}>
            {/* Volume Up Physical Button */}
            <TouchableOpacity
              style={[styles.buttonZone, styles.btnUp, volUp && styles.btnActive]}
              onPress={handlePressUp}
              activeOpacity={0.8}
            >
              <Ionicons
                name={volUp ? 'checkmark' : 'add'}
                size={16}
                color={volUp ? '#000000' : '#FFFFFF'}
              />
            </TouchableOpacity>

            {/* Volume Down Physical Button */}
            <TouchableOpacity
              style={[styles.buttonZone, styles.btnDown, volDown && styles.btnActive]}
              onPress={handlePressDown}
              activeOpacity={0.8}
            >
              <Ionicons
                name={volDown ? 'checkmark' : 'remove'}
                size={16}
                color={volDown ? '#000000' : '#FFFFFF'}
              />
            </TouchableOpacity>

            <View style={styles.screenNotch}>
              <View style={styles.island} />
            </View>
          </View>

          <Text style={styles.schematicLabel}>
            Press physical buttons on phone and tap corresponding indicators
          </Text>
        </GlassView>

        {/* Status Indicators */}
        <View style={styles.statusRow}>
          <GlassView
            intensity={volUp ? 50 : 25}
            style={[styles.statusTile, volUp && styles.statusTileActive]}
          >
            <Ionicons
              name={volUp ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={volUp ? colors.systemGreen : colors.textTertiary}
            />
            <Text style={styles.statusTileText}>Volume Up</Text>
          </GlassView>

          <GlassView
            intensity={volDown ? 50 : 25}
            style={[styles.statusTile, volDown && styles.statusTileActive]}
          >
            <Ionicons
              name={volDown ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={volDown ? colors.systemGreen : colors.textTertiary}
            />
            <Text style={styles.statusTileText}>Volume Down</Text>
          </GlassView>
        </View>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="Volume Switches Confirmed"
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
  chassisCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: radius.xl,
    gap: spacing.md,
  },
  phoneBody: {
    width: 140,
    height: 220,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    paddingTop: 14,
    position: 'relative',
  },
  buttonZone: {
    position: 'absolute',
    left: -18,
    width: 24,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnUp: { top: 50 },
  btnDown: { top: 110 },
  btnActive: {
    backgroundColor: colors.systemGreen,
    borderColor: colors.systemGreen,
  },
  screenNotch: {
    alignItems: 'center',
  },
  island: {
    width: 44,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000000',
  },
  schematicLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  statusTileActive: {
    borderColor: 'rgba(48, 209, 88, 0.35)',
  },
  statusTileText: {
    ...typography.headline,
    color: '#FFFFFF',
    fontSize: 15,
  },
});
