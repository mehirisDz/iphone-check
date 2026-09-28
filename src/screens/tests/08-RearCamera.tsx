import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';

export function RearCameraTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const test = TEST_REGISTRY.find(t => t.id === 'rear-camera')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'rear-camera');

  if (!permission?.granted) {
    return (
      <TestShell
        test={test}
        stepIndex={stepIndex}
        total={TEST_REGISTRY.length}
        onPass={onPass}
        onFail={onFail}
        onSkip={onSkip}
      >
        <View style={styles.permContainer}>
          <GlassView intensity={40} style={styles.permCard}>
            <Ionicons name="camera-outline" size={44} color="#FFFFFF" />
            <Text style={styles.permTitle}>Rear Camera Access</Text>
            <Text style={styles.permDesc}>
              Allows optical verification of the primary multi-lens sensor array and autofocus.
            </Text>
            <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
              <Text style={styles.permBtnText}>Grant Access</Text>
            </TouchableOpacity>
          </GlassView>
        </View>
      </TestShell>
    );
  }

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
        <View style={styles.viewfinder}>
          <CameraView style={StyleSheet.absoluteFill} facing="back" />

          {/* Corner Target Markers */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Live Sensor Badge */}
          <GlassView intensity={50} style={styles.sensorHUD}>
            <View style={styles.liveDot} />
            <Text style={styles.sensorHUDText}>Main Fusion Lens · 1x</Text>
          </GlassView>
        </View>

        <Text style={styles.hint}>
          Point at near and far objects to confirm autofocus, sensor clarity, and OIS stability
        </Text>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  permContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: radius.xl,
    gap: spacing.md,
    maxWidth: 320,
  },
  permTitle: {
    ...typography.headline,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  permDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  permBtn: {
    backgroundColor: colors.systemGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  permBtnText: {
    ...typography.headline,
    color: '#000000',
    fontWeight: '700' as const,
    fontSize: 15,
  },
  viewfinder: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
  },
  cornerTL: { top: 16, left: 16, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 16, right: 16, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 16, left: 16, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 16, right: 16, borderBottomWidth: 2, borderRightWidth: 2 },
  sensorHUD: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.systemGreen,
  },
  sensorHUDText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
