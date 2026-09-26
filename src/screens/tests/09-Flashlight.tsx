import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

export function FlashlightTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const test = TEST_REGISTRY.find(t => t.id === 'flashlight')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'flashlight');

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
          <Text style={styles.permText}>Camera permission is needed to control the flashlight.</Text>
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
        {/* Hidden camera required to keep torch active */}
        <CameraView
          style={styles.hiddenCamera}
          facing="back"
          enableTorch={torchOn}
        />

        <TouchableOpacity
          style={[styles.torchBtn, torchOn && styles.torchBtnOn]}
          onPress={() => setTorchOn(prev => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.torchIcon}>{torchOn ? '🔦' : '🔅'}</Text>
          <Text style={[styles.torchLabel, torchOn && styles.torchLabelOn]}>
            {torchOn ? 'Torch is ON' : 'Tap to Turn On'}
          </Text>
        </TouchableOpacity>

        <View style={[styles.statusBox, {
          backgroundColor: torchOn ? colors.passDim : colors.surface,
          borderColor: torchOn ? colors.pass : colors.border,
        }]}>
          <Text style={[styles.statusText, { color: torchOn ? colors.pass : colors.textSecondary }]}>
            {torchOn ? 'Check that the rear flash LED is brightly lit' : 'Press the button above to activate the torch'}
          </Text>
        </View>
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
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  hiddenCamera: { width: 1, height: 1, position: 'absolute', opacity: 0 },
  torchBtn: { width: 160, height: 160, borderRadius: 80, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border, gap: spacing.sm },
  torchBtnOn: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  torchIcon: { fontSize: 48 },
  torchLabel: { ...typography.headline, color: colors.textSecondary },
  torchLabelOn: { color: colors.accent },
  statusBox: { width: '100%', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.callout, textAlign: 'center' },
});
