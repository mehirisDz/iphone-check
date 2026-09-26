import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Network from 'expo-network';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { MetricCard } from '../../components/MetricCard';

export function WiFiTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [networkState, setNetworkState] = useState<Network.NetworkState | null>(null);
  const [ipAddress, setIpAddress] = useState<string>('');
  const [checked, setChecked] = useState(false);
  const test = TEST_REGISTRY.find(t => t.id === 'wifi')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'wifi');

  useEffect(() => {
    (async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setNetworkState(state);

        try {
          const ip = await Network.getIpAddressAsync();
          setIpAddress(ip);
        } catch (_) {
          setIpAddress('N/A');
        }

        setChecked(true);

        if (state.isConnected && state.type === Network.NetworkStateType.WIFI) {
          setTimeout(() => onPass(), 600);
        }
      } catch (error) {
        console.warn('Wi-Fi test error:', error);
        setChecked(true);
      }
    })();
  }, [onPass]);

  const isWifi = networkState?.type === Network.NetworkStateType.WIFI;
  const isConnected = networkState?.isConnected ?? false;

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        {!checked ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingIcon}>📶</Text>
            <Text style={styles.loadingText}>Checking Wi-Fi…</Text>
          </View>
        ) : (
          <>
            <View style={[styles.iconRing, {
              borderColor: isWifi ? colors.pass : colors.warn,
              backgroundColor: isWifi ? colors.passDim : 'rgba(255,159,10,0.15)',
            }]}>
              <Text style={styles.wifiIcon}>{isWifi ? '📶' : '📵'}</Text>
            </View>

            <View style={styles.cards}>
              <MetricCard
                label="Status"
                value={isConnected ? 'Connected' : 'Disconnected'}
                accent={isConnected ? colors.pass : colors.fail}
                dimBg={isConnected ? colors.passDim : colors.failDim}
              />
              <MetricCard
                label="Type"
                value={networkState?.type === Network.NetworkStateType.WIFI ? 'Wi-Fi'
                  : networkState?.type === Network.NetworkStateType.CELLULAR ? 'Cellular'
                  : 'Other'}
                accent={isWifi ? colors.pass : colors.warn}
                dimBg={isWifi ? colors.passDim : 'rgba(255,159,10,0.15)'}
              />
            </View>

            {ipAddress ? (
              <View style={styles.ipCard}>
                <Text style={styles.ipLabel}>IP Address</Text>
                <Text style={styles.ipValue}>{ipAddress}</Text>
              </View>
            ) : null}

            <View style={[styles.statusBox, {
              backgroundColor: isWifi ? colors.passDim : colors.surface,
              borderColor: isWifi ? colors.pass : colors.border,
            }]}>
              <Text style={[styles.statusText, { color: isWifi ? colors.pass : colors.textSecondary }]}>
                {isWifi
                  ? '✓ Connected to Wi-Fi — Pass!'
                  : isConnected
                    ? 'Connected via cellular, not Wi-Fi. Wi-Fi may still work — tap Pass or Fail.'
                    : 'No network connection detected.'}
              </Text>
            </View>
          </>
        )}
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', gap: spacing.lg, justifyContent: 'center' },
  loadingBox: { alignItems: 'center', gap: spacing.md },
  loadingIcon: { fontSize: 64 },
  loadingText: { ...typography.headline, color: colors.textSecondary },
  iconRing: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  wifiIcon: { fontSize: 44 },
  cards: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
  ipCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, width: '100%', borderWidth: 1, borderColor: colors.border },
  ipLabel: { ...typography.footnote, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.xs },
  ipValue: { ...typography.title3, color: colors.accent, fontFamily: 'monospace' },
  statusBox: { width: '100%', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.callout, textAlign: 'center', lineHeight: 22 },
});
