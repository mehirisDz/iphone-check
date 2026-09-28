import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

export function MicrophoneTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [level, setLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const passedRef = useRef(false);

  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  const recorderState = useAudioRecorderState(recorder, 80);

  const test = TEST_REGISTRY.find(t => t.id === 'microphone')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'microphone');

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const { granted } = await requestRecordingPermissionsAsync();
        if (!granted) return;

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        await recorder.prepareToRecordAsync();
        recorder.record();
        if (isMounted) setIsReady(true);
      } catch (err) {
        console.warn('Mic init error:', err);
      }
    }

    init();

    return () => {
      isMounted = false;
      try {
        if (recorder.isRecording) {
          recorder.stop();
        }
      } catch (_) {}
      setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (recorderState && recorderState.metering !== undefined) {
      const db = recorderState.metering;
      const normalized = Math.max(0, Math.min(1, (db + 60) / 60));
      setLevel(normalized);
      setPeakLevel(prev => Math.max(prev, normalized));

      if (normalized > 0.28 && !passedRef.current) {
        passedRef.current = true;
        setShowSuccess(true);
      }
    }
  }, [recorderState]);

  const dbValue = level > 0 ? Math.round(-60 + level * 60) : -60;
  const peakDb = Math.round(-60 + peakLevel * 60);

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
        {/* Large Decibel Level Display */}
        <View style={styles.decibelHero}>
          <Text style={styles.decibelNum}>{dbValue}</Text>
          <Text style={styles.decibelUnit}>dB SPL</Text>
        </View>

        {/* Dynamic Frosted Glass Level Waveform */}
        <GlassView intensity={35} style={styles.waveMeterCard}>
          <View style={styles.waveRow}>
            {Array.from({ length: 24 }).map((_, i) => {
              const barHeight = Math.max(
                6,
                Math.sin((i / 24) * Math.PI) * (level * 50) + Math.random() * 4
              );
              const isActive = i / 24 <= level;

              return (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    {
                      height: barHeight,
                      backgroundColor: isActive
                        ? colors.systemGreen
                        : 'rgba(255, 255, 255, 0.1)',
                    },
                  ]}
                />
              );
            })}
          </View>
        </GlassView>

        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          <GlassView intensity={30} style={styles.metricCard}>
            <Text style={styles.metricLabel}>Peak Amplitude</Text>
            <Text style={styles.metricValue}>{peakDb} dB</Text>
          </GlassView>

          <GlassView intensity={30} style={styles.metricCard}>
            <Text style={styles.metricLabel}>Mic Status</Text>
            <Text
              style={[
                styles.metricValue,
                { color: isReady ? colors.systemGreen : colors.systemOrange },
              ]}
            >
              {isReady ? 'Listening' : 'Initializing'}
            </Text>
          </GlassView>
        </View>

        {/* Audio Verification Prompt */}
        <GlassView intensity={25} style={styles.promptGlass}>
          <Text style={styles.promptText}>
            Speak, tap the casing, or clap near the phone to register audio input
          </Text>
        </GlassView>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="Microphone Active"
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
  decibelHero: {
    alignItems: 'center',
    gap: 4,
  },
  decibelNum: {
    ...typography.metric,
    color: '#FFFFFF',
  },
  decibelUnit: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1.5,
    fontWeight: '700' as const,
  },
  waveMeterCard: {
    padding: spacing.xl,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 60,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  metricValue: {
    ...typography.headline,
    color: '#FFFFFF',
    fontWeight: '700' as const,
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
    textAlign: 'center',
  },
});
