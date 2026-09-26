import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { LiveMeter } from '../../components/LiveMeter';
import { MetricCard } from '../../components/MetricCard';

export function AccelerometerTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [magnitude, setMagnitude] = useState(0);
  const [shakeDetected, setShakeDetected] = useState(false);
  const passedRef = useRef(false);
  const test = TEST_REGISTRY.find(t => t.id === 'accelerometer')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'accelerometer');

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener((d) => {
      setData(d);
      const mag = Math.sqrt(d.x * d.x + d.y * d.y + d.z * d.z);
      setMagnitude(mag);
      if (mag > 2.5 && !passedRef.current) {
        passedRef.current = true;
        setShakeDetected(true);
        setTimeout(() => onPass(), 800);
      }
    });
    return () => sub.remove();
  }, [onPass]);

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={styles.cards}>
          <MetricCard label="X" value={data.x.toFixed(2)} accent={colors.accent} />
          <MetricCard label="Y" value={data.y.toFixed(2)} accent={colors.accent} />
          <MetricCard label="Z" value={data.z.toFixed(2)} accent={colors.accent} />
        </View>
        <View style={styles.magSection}>
          <LiveMeter value={Math.min(magnitude / 4, 1)} label="Magnitude" displayValue={magnitude.toFixed(2)} unit="g" />
        </View>
        <View style={[styles.statusBox, { backgroundColor: shakeDetected ? colors.passDim : colors.surface, borderColor: shakeDetected ? colors.pass : colors.border }]}>
          <Text style={[styles.statusText, { color: shakeDetected ? colors.pass : colors.textSecondary }]}>
            {shakeDetected ? '✓ Shake Detected — Pass!' : 'Shake the phone to trigger'}
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg },
  cards: { flexDirection: 'row', gap: spacing.sm },
  magSection: { gap: spacing.sm },
  statusBox: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.headline, textAlign: 'center' },
});
