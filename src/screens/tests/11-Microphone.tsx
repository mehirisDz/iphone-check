import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { LiveMeter } from '../../components/LiveMeter';

export function MicrophoneTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [level, setLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [detected, setDetected] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const passedRef = useRef(false);
  const test = TEST_REGISTRY.find(t => t.id === 'microphone')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'microphone');

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);

      // Poll metering
      const interval = setInterval(async () => {
        if (recordingRef.current) {
          try {
            const status = await recordingRef.current.getStatusAsync();
            if (status.isRecording && status.metering !== undefined) {
              // metering is in dB, typically -160 to 0
              const normalized = Math.max(0, Math.min(1, (status.metering + 60) / 60));
              setLevel(normalized);
              setPeakLevel(prev => Math.max(prev, normalized));
              if (normalized > 0.3 && !passedRef.current) {
                passedRef.current = true;
                setDetected(true);
                setTimeout(() => onPass(), 800);
              }
            }
          } catch (_) {
            // recording may have stopped
          }
        }
      }, 100);

      return () => clearInterval(interval);
    } catch (error) {
      console.warn('Microphone test error:', error);
    }
  };

  useEffect(() => {
    startRecording();
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }
      Audio.setAudioModeAsync({ allowsRecordingIOS: false }).catch(() => {});
    };
  }, []);

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
            {detected ? '✓ Microphone detected input — Pass!' : isRecording ? 'Speak or clap near the phone…' : 'Starting microphone…'}
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
