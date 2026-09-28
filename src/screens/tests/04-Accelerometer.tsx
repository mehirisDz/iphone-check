import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

export function AccelerometerTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [magnitude, setMagnitude] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const passedRef = useRef(false);

  const test = TEST_REGISTRY.find(t => t.id === 'accelerometer')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'accelerometer');

  useEffect(() => {
    Accelerometer.setUpdateInterval(60);
    const sub = Accelerometer.addListener(d => {
      setData(d);
      const mag = Math.sqrt(d.x * d.x + d.y * d.y + d.z * d.z);
      setMagnitude(mag);

      if (mag > 2.2 && !passedRef.current) {
        passedRef.current = true;
        setShowSuccess(true);
      }
    });

    return () => sub.remove();
  }, []);

  const progress = Math.min(magnitude / 3.0, 1);

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
        {/* Large Live G-Force Readout */}
        <View style={styles.metricHero}>
          <Text style={styles.heroNumber}>{magnitude.toFixed(2)}</Text>
          <Text style={styles.heroUnit}>G-FORCE</Text>
        </View>

        {/* Dynamic Frosted Glass Level Bar */}
        <GlassView intensity={30} style={styles.meterCard}>
          <View style={styles.meterHeader}>
            <Text style={styles.meterLabel}>Total Acceleration</Text>
            <Text style={styles.meterValue}>{magnitude.toFixed(2)} g</Text>
          </View>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${progress * 100}%` as any,
                  backgroundColor:
                    progress > 0.7 ? colors.systemGreen : colors.systemBlue,
                },
              ]}
            />
          </View>
        </GlassView>

        {/* 3-Axis Precision Breakdown Cards */}
        <View style={styles.axisRow}>
          <GlassView intensity={35} style={styles.axisCard}>
            <Text style={styles.axisLabel}>X AXIS</Text>
            <Text style={styles.axisValue}>{data.x.toFixed(2)}</Text>
            <Text style={styles.axisUnit}>g</Text>
          </GlassView>

          <GlassView intensity={35} style={styles.axisCard}>
            <Text style={styles.axisLabel}>Y AXIS</Text>
            <Text style={styles.axisValue}>{data.y.toFixed(2)}</Text>
            <Text style={styles.axisUnit}>g</Text>
          </GlassView>

          <GlassView intensity={35} style={styles.axisCard}>
            <Text style={styles.axisLabel}>Z AXIS</Text>
            <Text style={styles.axisValue}>{data.z.toFixed(2)}</Text>
            <Text style={styles.axisUnit}>g</Text>
          </GlassView>
        </View>

        {/* Status Prompt */}
        <GlassView intensity={25} style={styles.promptGlass}>
          <Text style={styles.promptText}>
            Shake or briskly tilt phone to trigger motion sensor
          </Text>
        </GlassView>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="Motion Sensor Verified"
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
  metricHero: {
    alignItems: 'center',
    gap: 2,
  },
  heroNumber: {
    ...typography.metric,
    color: '#FFFFFF',
  },
  heroUnit: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1.5,
    fontWeight: '700' as const,
  },
  meterCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: 8,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  meterLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  meterValue: {
    ...typography.footnote,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  meterTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  axisRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  axisCard: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.lg,
    gap: 2,
  },
  axisLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: '700' as const,
  },
  axisValue: {
    ...typography.title2,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  axisUnit: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  promptGlass: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  promptText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
