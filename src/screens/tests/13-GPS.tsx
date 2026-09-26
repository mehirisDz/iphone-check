import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { LiveMeter } from '../../components/LiveMeter';
import { MetricCard } from '../../components/MetricCard';

export function GPSTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string>('');
  const [searching, setSearching] = useState(true);
  const passedRef = useRef(false);
  const test = TEST_REGISTRY.find(t => t.id === 'gps')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'gps');

  useEffect(() => {
    let watchSub: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setSearching(false);
        return;
      }

      watchSub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 0,
        },
        (loc) => {
          setLocation(loc);
          setSearching(false);
          const acc = loc.coords.accuracy ?? 999;
          if (acc < 100 && !passedRef.current) {
            passedRef.current = true;
            setTimeout(() => onPass(), 800);
          }
        }
      );
    })();

    return () => {
      if (watchSub) watchSub.remove();
    };
  }, [onPass]);

  const accuracy = location?.coords.accuracy ?? null;
  const accNormalized = accuracy ? Math.max(0, Math.min(1, 1 - accuracy / 200)) : 0;

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        {error ? (
          <View style={[styles.statusBox, { backgroundColor: colors.failDim, borderColor: colors.fail }]}>
            <Text style={[styles.statusText, { color: colors.fail }]}>{error}</Text>
          </View>
        ) : searching ? (
          <View style={styles.searchingBox}>
            <Text style={styles.searchIcon}>📡</Text>
            <Text style={styles.searchText}>Searching for GPS signal…</Text>
          </View>
        ) : location ? (
          <>
            <View style={styles.cards}>
              <MetricCard label="Latitude" value={location.coords.latitude.toFixed(6)} accent={colors.accent} />
              <MetricCard label="Longitude" value={location.coords.longitude.toFixed(6)} accent={colors.accent} />
            </View>

            <View style={styles.cards}>
              <MetricCard
                label="Accuracy"
                value={accuracy ? `${accuracy.toFixed(0)}` : '—'}
                unit="m"
                accent={accuracy && accuracy < 100 ? colors.pass : colors.warn}
                dimBg={accuracy && accuracy < 100 ? colors.passDim : 'rgba(255,159,10,0.15)'}
              />
              <MetricCard
                label="Altitude"
                value={location.coords.altitude !== null ? `${location.coords.altitude.toFixed(0)}` : '—'}
                unit="m"
                accent={colors.accent}
              />
            </View>

            <LiveMeter
              value={accNormalized}
              label="GPS Accuracy"
              displayValue={accuracy ? `${accuracy.toFixed(0)} m` : '—'}
              color={accuracy && accuracy < 100 ? colors.pass : colors.warn}
            />

            <View style={[styles.statusBox, {
              backgroundColor: accuracy && accuracy < 100 ? colors.passDim : colors.surface,
              borderColor: accuracy && accuracy < 100 ? colors.pass : colors.border,
            }]}>
              <Text style={[styles.statusText, { color: accuracy && accuracy < 100 ? colors.pass : colors.textSecondary }]}>
                {accuracy && accuracy < 100 ? '✓ GPS fix acquired — Pass!' : 'Waiting for better accuracy (<100m)…'}
              </Text>
            </View>
          </>
        ) : null}
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg },
  cards: { flexDirection: 'row', gap: spacing.sm },
  searchingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  searchIcon: { fontSize: 64 },
  searchText: { ...typography.headline, color: colors.textSecondary },
  statusBox: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.headline, textAlign: 'center' },
});
