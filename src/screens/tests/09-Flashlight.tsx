import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';

export function FlashlightTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [torchOn, setTorchOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const test = TEST_REGISTRY.find(t => t.id === 'flashlight')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'flashlight');

  const toggleTorch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    setTorchOn(prev => !prev);
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
        {/* Hidden CameraView to drive hardware LED torch */}
        {permission?.granted && (
          <CameraView
            style={styles.hiddenCamera}
            facing="back"
            enableTorch={torchOn}
          />
        )}

        {/* Apple Control Center Style Torch Tile */}
        <TouchableOpacity
          style={styles.tileWrapper}
          onPress={toggleTorch}
          activeOpacity={0.8}
        >
          <GlassView
            intensity={torchOn ? 70 : 35}
            style={[styles.torchTile, torchOn && styles.torchTileActive]}
          >
            <View
              style={[
                styles.iconGlowRing,
                torchOn && styles.iconGlowRingActive,
              ]}
            >
              <Ionicons
                name={torchOn ? 'flash' : 'flash-off-outline'}
                size={44}
                color={torchOn ? '#000000' : '#FFFFFF'}
              />
            </View>

            <Text style={[styles.tileLabel, torchOn && styles.tileLabelActive]}>
              {torchOn ? 'Torch Active' : 'Tap to Activate'}
            </Text>
          </GlassView>
        </TouchableOpacity>

        {/* Verification Status Banner */}
        <GlassView intensity={30} style={styles.statusGlass}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={torchOn ? colors.systemGreen : colors.textSecondary}
          />
          <Text style={styles.statusText}>
            {torchOn
              ? 'True Tone quad-LED flash illuminated — check back of phone'
              : 'Tap the tile to power on the True Tone rear flash module'}
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
    alignItems: 'center',
    gap: spacing.xl,
  },
  hiddenCamera: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
  },
  tileWrapper: {
    width: 180,
    height: 220,
  },
  torchTile: {
    flex: 1,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  torchTileActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 12,
  },
  iconGlowRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlowRingActive: {
    backgroundColor: '#000000',
  },
  tileLabel: {
    ...typography.headline,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  tileLabelActive: {
    color: '#000000',
  },
  statusGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    gap: 10,
    maxWidth: 340,
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});
