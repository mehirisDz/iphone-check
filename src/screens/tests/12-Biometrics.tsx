import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

export function BiometricsTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [authType, setAuthType] = useState<'Face ID' | 'Touch ID' | 'Biometrics'>('Face ID');
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'success' | 'failed'>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const passedRef = useRef(false);

  const test = TEST_REGISTRY.find(t => t.id === 'biometrics')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'biometrics');

  useEffect(() => {
    async function checkAndPrompt() {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setAuthType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setAuthType('Touch ID');
      }

      triggerBiometricAuth();
    }

    checkAndPrompt();
  }, []);

  const triggerBiometricAuth = async () => {
    setStatus('authenticating');
    try {
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Apple Hardware Biometrics Inspection',
        fallbackLabel: 'Use Device Passcode',
        cancelLabel: 'Cancel',
      });

      if (res.success && !passedRef.current) {
        passedRef.current = true;
        setStatus('success');
        setShowSuccess(true);
      } else {
        setStatus('failed');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      }
    } catch (err) {
      console.warn('Biometric error:', err);
      setStatus('failed');
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
      autoResult={true}
    >
      <View style={styles.container}>
        {/* Apple Face ID / Touch ID Frosted Sensor Card */}
        <GlassView intensity={40} style={styles.sensorCard}>
          <View style={styles.iconRing}>
            <Ionicons
              name={authType === 'Face ID' ? 'scan-outline' : 'finger-print'}
              size={54}
              color={
                status === 'success'
                  ? colors.systemGreen
                  : status === 'failed'
                  ? colors.systemRed
                  : '#FFFFFF'
              }
            />
          </View>

          <Text style={styles.authTitle}>Apple {authType}</Text>
          <Text style={styles.authSub}>
            Secure Enclave Cryptographic Hardware Verification
          </Text>

          {status === 'failed' && (
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={triggerBiometricAuth}
              activeOpacity={0.8}
            >
              <Text style={styles.retryBtnText}>Authenticate Again</Text>
            </TouchableOpacity>
          )}
        </GlassView>

        <GlassView intensity={25} style={styles.statusGlass}>
          <Text style={styles.statusText}>
            {status === 'authenticating'
              ? 'Verifying biometric sensor with Secure Enclave...'
              : status === 'success'
              ? 'Biometric sensor validated successfully'
              : 'Prompting for biometric recognition'}
          </Text>
        </GlassView>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title={`${authType} Verified`}
        onFinish={onPass}
      />
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
  sensorCard: {
    padding: spacing.xxl,
    alignItems: 'center',
    borderRadius: radius.xl,
    gap: spacing.md,
    width: '100%',
    maxWidth: 320,
  },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  authTitle: {
    ...typography.title2,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  authSub: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  retryBtn: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
  },
  retryBtnText: {
    ...typography.footnote,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  statusGlass: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
