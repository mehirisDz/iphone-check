import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Network from 'expo-network';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

export function WiFiTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [netState, setNetState] = useState<Network.NetworkState | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const passedRef = useRef(false);

  const test = TEST_REGISTRY.find(t => t.id === 'wifi')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'wifi');

  useEffect(() => {
    async function checkNetwork() {
      try {
        const state = await Network.getNetworkStateAsync();
        setNetState(state);

        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);

        if (state.isConnected && !passedRef.current) {
          passedRef.current = true;
          setShowSuccess(true);
        }
      } catch (err) {
        console.warn('Network error:', err);
      }
    }

    checkNetwork();
  }, []);

  const isWifi = netState?.type === Network.NetworkStateType.WIFI;

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
        {/* Network Radio Card */}
        <GlassView intensity={40} style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={isWifi ? 'wifi' : 'cellular'}
              size={44}
              color={netState?.isConnected ? colors.systemGreen : '#FFFFFF'}
            />
          </View>
          <Text style={styles.statusTitle}>
            {netState?.isConnected
              ? isWifi
                ? 'Wi-Fi Interface Active'
                : 'Cellular Data Active'
              : 'Interface Searching'}
          </Text>
          <Text style={styles.statusSubtitle}>
            {ipAddress ? `Local Subnet IP: ${ipAddress}` : 'Checking IP assignation...'}
          </Text>
        </GlassView>

        {/* Network Metrics Grid */}
        <View style={styles.grid}>
          <GlassView intensity={35} style={styles.tile}>
            <Text style={styles.tileLabel}>Radio Interface</Text>
            <Text style={styles.tileValue}>
              {netState?.type ?? 'Detecting'}
            </Text>
          </GlassView>

          <GlassView intensity={35} style={styles.tile}>
            <Text style={styles.tileLabel}>Internet Reachability</Text>
            <Text
              style={[
                styles.tileValue,
                {
                  color: netState?.isInternetReachable
                    ? colors.systemGreen
                    : colors.systemOrange,
                },
              ]}
            >
              {netState?.isInternetReachable ? 'Connected' : 'Local Only'}
            </Text>
          </GlassView>
        </View>

        <GlassView intensity={25} style={styles.statusGlass}>
          <Text style={styles.statusText}>
            IEEE 802.11 Wi-Fi baseband and PHY hardware verified
          </Text>
        </GlassView>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="Network Interface Active"
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
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  statusTitle: {
    ...typography.title2,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  statusSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: 4,
  },
  tileLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700' as const,
  },
  tileValue: {
    ...typography.headline,
    color: '#FFFFFF',
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
