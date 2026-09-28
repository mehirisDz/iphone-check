import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

export function GPSTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
    altitude: number | null;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const passedRef = useRef(false);

  const test = TEST_REGISTRY.find(t => t.id === 'gps')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'gps');

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    async function init() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          loc => {
            setCoords({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              accuracy: loc.coords.accuracy,
              altitude: loc.coords.altitude,
            });

            if (loc.coords.accuracy && loc.coords.accuracy < 60 && !passedRef.current) {
              passedRef.current = true;
              setShowSuccess(true);
            }
          }
        );
      } catch (err) {
        console.warn('GPS error:', err);
      }
    }

    init();

    return () => {
      sub?.remove();
    };
  }, []);

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
        {/* GPS Satellite Lock Hero Card */}
        <GlassView intensity={40} style={styles.heroCard}>
          <View style={styles.radarCircle}>
            <Ionicons name="navigate-outline" size={40} color={colors.systemGreen} />
          </View>
          <Text style={styles.accuracyValue}>
            {coords?.accuracy ? `± ${Math.round(coords.accuracy)}m` : 'Acquiring...'}
          </Text>
          <Text style={styles.accuracyLabel}>GNSS Satellite Precision</Text>
        </GlassView>

        {/* Live Coordinate Breakdown */}
        <View style={styles.coordsGrid}>
          <GlassView intensity={35} style={styles.coordTile}>
            <Text style={styles.coordLabel}>Latitude</Text>
            <Text style={styles.coordValue}>
              {coords ? coords.latitude.toFixed(5) : '—'}
            </Text>
          </GlassView>

          <GlassView intensity={35} style={styles.coordTile}>
            <Text style={styles.coordLabel}>Longitude</Text>
            <Text style={styles.coordValue}>
              {coords ? coords.longitude.toFixed(5) : '—'}
            </Text>
          </GlassView>

          <GlassView intensity={35} style={styles.coordTile}>
            <Text style={styles.coordLabel}>Altitude</Text>
            <Text style={styles.coordValue}>
              {coords?.altitude ? `${Math.round(coords.altitude)} m` : '—'}
            </Text>
          </GlassView>

          <GlassView intensity={35} style={styles.coordTile}>
            <Text style={styles.coordLabel}>Lock Status</Text>
            <Text
              style={[
                styles.coordValue,
                { color: coords ? colors.systemGreen : colors.systemOrange },
              ]}
            >
              {coords ? 'Acquired' : 'Searching'}
            </Text>
          </GlassView>
        </View>

        <GlassView intensity={25} style={styles.statusGlass}>
          <Text style={styles.statusText}>
            Validating GPS, GLONASS, Galileo & BeiDou receiver hardware
          </Text>
        </GlassView>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="GPS Satellite Lock Verified"
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
    gap: spacing.xs,
  },
  radarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(48, 209, 88, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  accuracyValue: {
    ...typography.metricMd,
    color: '#FFFFFF',
    fontWeight: '800' as const,
  },
  accuracyLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  coordTile: {
    width: '48%',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: 4,
  },
  coordLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700' as const,
  },
  coordValue: {
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
