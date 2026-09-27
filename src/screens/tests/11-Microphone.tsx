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
import { LiveMeter } from '../../components/LiveMeter';

export function MicrophoneTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [level, setLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);
  const [detected, setDetected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const passedRef = useRef(false);

  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  const recorderState = useAudioRecorderState(recorder, 100);

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
        console.warn('Microphone init error:', err);
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
      // metering is in dB, typically -160 to 0
      const db = recorderState.metering;
      const normalized = Math.max(0, Math.min(1, (db + 60) / 60));
      setLevel(normalized);
      setPeakLevel(prev => Math.max(prev, normalized));

      if (normalized > 0.25 && !passedRef.current) {
        passedRef.current = true;
        setDetected(true);
        setTimeout(() => onPass(), 800);
      }
    }
  }, [recorderState, onPass]);

  const dbValue = level > 0 ? Math.round(-60 + level * 60) : -60;

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        <View style={styles.bigNumBox}>
          <Text style={styles.bigNum}>{dbValue}</Text>
          <Text style={styles.bigUnit}>dB</Text>
        </View>

        <LiveMeter value={level} label="Input Level" displayValue={`${dbValue} dB`} />

        <View style={styles.peakRow}>
          <Text style={styles.peakLabel}>Peak Level</Text>
          <Text style={styles.peakValue}>{Math.round(-60 + peakLevel * 60)} dB</Text>
        </View>

        <View style={[styles.statusBox, {
          backgroundColor: detected ? colors.passDim : colors.surface,
          borderColor: detected ? colors.pass : colors.border,
        }]}>
          <Text style={[styles.statusText, { color: detected ? colors.pass : colors.textSecondary }]}>
            {detected ? '✓ Microphone detected input — Pass!' : isReady ? 'Speak or clap near the phone…' : 'Starting microphone…'}
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  bigNumBox: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  bigNum: { fontSize: 72, fontWeight: '800' as const, color: colors.accent, letterSpacing: -3 },
  bigUnit: { ...typography.title3, color: colors.textSecondary },
  peakRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: spacing.sm },
  peakLabel: { ...typography.footnote, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.8 },
  peakValue: { ...typography.footnote, color: colors.accent, fontWeight: '700' as const },
  statusBox: { width: '100%', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.headline, textAlign: 'center' },
});
