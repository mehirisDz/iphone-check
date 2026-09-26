import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

function getHeading(x: number, y: number): number {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  angle = (angle + 360) % 360;
  return Math.round(angle);
}

const DIRECTIONS = ['N','NE','E','SE','S','SW','W','NW'];
function dir(deg: number) {
  return DIRECTIONS[Math.round(deg / 45) % 8];
}

export function CompassTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [heading, setHeading] = useState(0);
  const [active, setActive] = useState(false);
  const [passReady, setPassReady] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const prevHeading = useRef(0);
  const totalRotation = useRef(0);
  const test = TEST_REGISTRY.find(t => t.id === 'compass')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'compass');

  useEffect(() => {
    Magnetometer.setUpdateInterval(100);
    const sub = Magnetometer.addListener((d) => {
      const h = getHeading(d.x, d.y);
      const diff = Math.abs(h - prevHeading.current);
      totalRotation.current += diff;
      prevHeading.current = h;
      setHeading(h);
      setActive(true);
      if (totalRotation.current > 90) setPassReady(true);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    Animated.timing(rotateAnim, { toValue: heading, duration: 200, useNativeDriver: true }).start();
  }, [heading, rotateAnim]);

  const rotate = rotateAnim.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={styles.compassRing}>
          <Animated.Text style={[styles.needle, { transform: [{ rotate }] }]}>⬆︎</Animated.Text>
          <Text style={styles.heading}>{heading}°</Text>
          <Text style={styles.direction}>{dir(heading)}</Text>
        </View>
        <View style={[styles.statusBox, { backgroundColor: passReady ? colors.passDim : colors.surface, borderColor: passReady ? colors.pass : colors.border }]}>
          <Text style={[styles.statusText, { color: passReady ? colors.pass : colors.textSecondary }]}>
            {!active ? 'Waiting for sensor…' : passReady ? '✓ Compass responding — tap Pass' : 'Slowly rotate the phone…'}
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', gap: spacing.xl, paddingTop: spacing.lg },
  compassRing: { width: 200, height: 200, borderRadius: 100, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  needle: { fontSize: 48, position: 'absolute', top: 20, color: colors.accent },
  heading: { fontSize: 48, fontWeight: '800' as const, color: colors.accent, letterSpacing: -2 },
  direction: { ...typography.headline, color: colors.textSecondary },
  statusBox: { width: '100%', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.headline, textAlign: 'center' },
});
