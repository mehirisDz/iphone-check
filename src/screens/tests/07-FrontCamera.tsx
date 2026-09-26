import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

export function FrontCameraTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const test = TEST_REGISTRY.find(t => t.id === 'front-camera')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'front-camera');

  if (!permission) {
    return (
      <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
        <View style={styles.center}>
          <Text style={styles.loading}>Requesting camera…</Text>
        </View>
      </TestShell>
    );
  }

  if (!permission.granted) {
    return (
      <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
        <View style={styles.center}>
          <Text style={styles.permText}>Camera permission is required for this test.</Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </TestShell>
    );
  }

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={styles.cameraBox}>
          <CameraView style={styles.camera} facing="front" />
        </View>
        <Text style={styles.hint}>Check for clear focus, color accuracy, and no artifacts.</Text>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loading: { ...typography.body, color: colors.textSecondary },
  permText: { ...typography.callout, textAlign: 'center', paddingHorizontal: spacing.lg },
  permBtn: { backgroundColor: colors.accentBlueDim, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.accentBlue },
  permBtnText: { ...typography.headline, color: colors.accentBlue },
  container: { flex: 1, gap: spacing.md },
  cameraBox: { flex: 1, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 2, borderColor: colors.border },
  camera: { flex: 1 },
  hint: { ...typography.callout, textAlign: 'center' },
});
