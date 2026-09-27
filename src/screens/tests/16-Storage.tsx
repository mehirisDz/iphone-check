import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Paths } from 'expo-file-system';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { LiveMeter } from '../../components/LiveMeter';
import { MetricCard } from '../../components/MetricCard';

function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return (bytes / 1e12).toFixed(1) + ' TB';
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + ' GB';
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB';
  return (bytes / 1e3).toFixed(0) + ' KB';
}

export function StorageTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [total, setTotal] = useState<number | null>(null);
  const [free, setFree] = useState<number | null>(null);
  const test = TEST_REGISTRY.find(t => t.id === 'storage')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'storage');

  useEffect(() => {
    try {
      const totalBytes = Paths.totalDiskSpace;
      const freeBytes = Paths.availableDiskSpace;
      setTotal(totalBytes);
      setFree(freeBytes);

      // Auto-pass if we got valid readings
      if (totalBytes > 0) {
        setTimeout(() => onPass(), 800);
      }
    } catch (error) {
      console.warn('Storage test error:', error);
    }
  }, [onPass]);

  const used = total && free ? total - free : null;
  const usedPercent = total && used ? used / total : 0;

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        {total === null ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingIcon}>💾</Text>
            <Text style={styles.loadingText}>Reading storage…</Text>
          </View>
        ) : (
          <>
            <View style={styles.bigNumBox}>
              <Text style={styles.bigNum}>{formatBytes(total)}</Text>
              <Text style={styles.bigLabel}>Total Capacity</Text>
            </View>

            <View style={styles.cards}>
              <MetricCard
                label="Used"
                value={used ? formatBytes(used) : '—'}
                accent={colors.warn}
                dimBg="rgba(255,159,10,0.15)"
              />
              <MetricCard
                label="Available"
                value={free ? formatBytes(free) : '—'}
                accent={colors.pass}
                dimBg={colors.passDim}
              />
            </View>

            <LiveMeter
              value={usedPercent}
              label="Storage Used"
              displayValue={`${Math.round(usedPercent * 100)}%`}
              color={usedPercent > 0.9 ? colors.fail : usedPercent > 0.75 ? colors.warn : colors.accent}
            />

            <View style={[styles.statusBox, { backgroundColor: colors.passDim, borderColor: colors.pass }]}>
              <Text style={[styles.statusText, { color: colors.pass }]}>
                ✓ Storage info retrieved successfully
              </Text>
            </View>
          </>
        )}
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg, justifyContent: 'center' },
  loadingBox: { alignItems: 'center', gap: spacing.md },
  loadingIcon: { fontSize: 64 },
  loadingText: { ...typography.headline, color: colors.textSecondary },
  bigNumBox: { alignItems: 'center', gap: spacing.xs },
  bigNum: { fontSize: 48, fontWeight: '800' as const, color: colors.accent, letterSpacing: -2 },
  bigLabel: { ...typography.callout },
  cards: { flexDirection: 'row', gap: spacing.sm },
  statusBox: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.headline, textAlign: 'center' },
});
