import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';

export function SpeakerTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(1000);
  const soundRef = useRef<Audio.Sound | null>(null);
  const test = TEST_REGISTRY.find(t => t.id === 'speaker')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'speaker');

  const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];
  const FREQ_LABELS = ['250 Hz', '500 Hz', '1 kHz', '2 kHz', '4 kHz', '8 kHz'];

  useEffect(() => {
    // Configure audio for speaker playback
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playTone = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Generate a WAV buffer for a pure sine tone
      const sampleRate = 44100;
      const duration = 2; // seconds
      const numSamples = sampleRate * duration;
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);

      // WAV header
      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
      };
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + numSamples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, numSamples * 2, true);

      // Sine wave samples
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const sample = Math.sin(2 * Math.PI * frequency * t) * 0.5;
        view.setInt16(44 + i * 2, sample * 32767, true);
      }

      // Convert to base64
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/wav;base64,${base64}` },
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && isPlaying) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.warn('Speaker test error:', error);
    }
  };

  const stopTone = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
  };

  return (
    <TestShell test={test} stepIndex={stepIndex} total={TEST_REGISTRY.length} onPass={onPass} onFail={onFail} onSkip={onSkip}>
      <View style={styles.container}>
        {/* Frequency picker */}
        <View style={styles.freqRow}>
          {FREQUENCIES.map((f, i) => (
            <TouchableOpacity
              key={f}
              style={[styles.freqPill, frequency === f && styles.freqPillActive]}
              onPress={() => { setFrequency(f); if (isPlaying) { stopTone().then(playTone); } }}
            >
              <Text style={[styles.freqText, frequency === f && styles.freqTextActive]}>{FREQ_LABELS[i]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Play button */}
        <TouchableOpacity
          style={[styles.playBtn, isPlaying && styles.playBtnActive]}
          onPress={isPlaying ? stopTone : playTone}
          activeOpacity={0.8}
        >
          <Text style={styles.playIcon}>{isPlaying ? '⏹' : '▶'}</Text>
          <Text style={[styles.playLabel, isPlaying && styles.playLabelActive]}>
            {isPlaying ? 'Stop' : 'Play Tone'}
          </Text>
        </TouchableOpacity>

        {/* Live indicator */}
        <View style={[styles.statusBox, {
          backgroundColor: isPlaying ? colors.accentDim : colors.surface,
          borderColor: isPlaying ? colors.accent : colors.border,
        }]}>
          <Text style={[styles.statusText, { color: isPlaying ? colors.accent : colors.textSecondary }]}>
            {isPlaying
              ? `Playing ${frequency >= 1000 ? (frequency / 1000) + ' kHz' : frequency + ' Hz'} tone — listen for clarity and distortion`
              : 'Tap Play to test the speaker'}
          </Text>
        </View>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  freqPill: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  freqPillActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  freqText: { ...typography.footnote, color: colors.textSecondary, fontWeight: '600' as const },
  freqTextActive: { color: colors.accent },
  playBtn: { width: 140, height: 140, borderRadius: 70, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border, gap: spacing.xs },
  playBtnActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  playIcon: { fontSize: 40 },
  playLabel: { ...typography.headline, color: colors.textSecondary },
  playLabelActive: { color: colors.accent },
  statusBox: { width: '100%', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statusText: { ...typography.callout, textAlign: 'center', lineHeight: 22 },
});
