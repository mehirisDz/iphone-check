import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

export function BiometricsTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'failed' | 'unavailable'>('idle');
  const [biometricType, setBiometricType] = useState<string>('');
  const test = TEST_REGISTRY.find(t => t.id === 'biometrics')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'biometrics');

  const runAuth = async () => {
    setStatus('checking');

    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      setStatus('unavailable');
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      setStatus('unavailable');
      setBiometricType('No biometrics enrolled');
      return;
    }

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const typeNames = types.map(t => {
      switch (t) {
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION: return 'Face ID';
        case LocalAuthentication.AuthenticationType.FINGERPRINT: return 'Touch ID';
        case LocalAuthentication.AuthenticationType.IRIS: return 'Iris';
        default: return 'Unknown';
      }
    });
    setBiometricType(typeNames.join(', '));

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Verify biometric sensor',
      disableDeviceFallback: true,
      cancelLabel: 'Cancel',
    });

    if (result.success) {
      setStatus('success');
      setTimeout(() => onPass(), 600);
    } else {
      setStatus('failed');
    }
  };

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={[styles.iconRing, {
          borderColor: status === 'success' ? colors.pass : status === 'failed' ? colors.fail : colors.accent,
          backgroundColor: status === 'success' ? colors.passDim : status === 'failed' ? colors.failDim : colors.accentDim,
        }]}>
          <Text style={styles.icon}>
            {status === 'success' ? '✓' : status === 'failed' ? '✗' : '🔐'}
          </Text>
        </View>

        {biometricType ? (
          <Text style={styles.typeLabel}>Detected: {biometricType}</Text>
        ) : null}

        {status === 'idle' && (
          <TouchableOpacity style={styles.authBtn} onPress={runAuth} activeOpacity={0.8}>
            <Text style={styles.authBtnText}>Authenticate</Text>
          </TouchableOpacity>
        )}

        {status === 'checking' && (
          <Text style={styles.statusText}>Waiting for authentication…</Text>
        )}

        {status === 'unavailable' && (
          <View style={styles.unavailBox}>
            <Text style={styles.unavailText}>
              Biometric hardware not available or not enrolled on this device.
            </Text>
            <Text style={styles.unavailHint}>
              This may indicate a hardware issue, or the feature hasn't been set up.
            </Text>
          </View>
        )}

        {status === 'success' && (
          <View style={[styles.statusBox, { backgroundColor: colors.passDim, borderColor: colors.pass }]}>
            <Text style={[styles.statusText, { color: colors.pass }]}>✓ Biometric authentication successful!</Text>
          </View>
        )}

        {status === 'failed' && (
          <View style={styles.failedSection}>
            <View style={[styles.statusBox, { backgroundColor: colors.failDim, borderColor: colors.fail }]}>
              <Text style={[styles.statusText, { color: colors.fail }]}>Authentication failed</Text>
            </View>
            <TouchableOpacity style={styles.retryBtn} onPress={runAuth}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  iconRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 48 },
  typeLabel: { ...typography.callout, color: colors.accent },
  authBtn: { backgroundColor: colors.accent, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill },
  authBtnText: { ...typography.headline, color: colors.background, fontWeight: '700' as const },
  statusBox: { width: '100%', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.headline, textAlign: 'center', color: colors.textSecondary },
  unavailBox: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  unavailText: { ...typography.callout, color: colors.warn, textAlign: 'center' },
  unavailHint: { ...typography.footnote, color: colors.textTertiary, textAlign: 'center' },
  failedSection: { width: '100%', gap: spacing.md, alignItems: 'center' },
  retryBtn: { backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  retryText: { ...typography.headline, color: colors.textPrimary },
});
