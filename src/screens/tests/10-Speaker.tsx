import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { File, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';

const FREQUENCIES = [
  { freq: 250, label: '250 Hz', sub: 'Low Bass' },
  { freq: 500, label: '500 Hz', sub: 'Mid Bass' },
  { freq: 1000, label: '1.0 kHz', sub: 'Standard' },
  { freq: 2000, label: '2.0 kHz', sub: 'Upper Mid' },
  { freq: 4000, label: '4.0 kHz', sub: 'Treble' },
  { freq: 8000, label: '8.0 kHz', sub: 'High' },
];

export function SpeakerTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState(1000);
  const playerRef = useRef<AudioPlayer | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const test = TEST_REGISTRY.find(t => t.id === 'speaker')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'speaker');

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    }).catch(() => {});

    return () => {
      stopTone();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  const playTone = async (freq = selectedFreq) => {
    try {
      stopTone();

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      const sampleRate = 44100;
      const duration = 1.5;
      const numSamples = Math.floor(sampleRate * duration);
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);

      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
      };
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + numSamples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, numSamples * 2, true);

      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const sample = Math.sin(2 * Math.PI * freq * t) * 0.55;
        view.setInt16(44 + i * 2, sample * 32767, true);
      }

      const bytes = new Uint8Array(buffer);
      const toneFile = new File(Paths.cache, `speaker_tone_${freq}.wav`);
      if (toneFile.exists) {
        toneFile.delete();
      }
      toneFile.create();
      toneFile.write(bytes);

      const player = createAudioPlayer({ uri: toneFile.uri });
      player.loop = true;
      player.play();
      playerRef.current = player;
      setIsPlaying(true);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  };

  const stopTone = () => {
    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.release();
      } catch (_) {}
      playerRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleSelectFreq = (freq: number) => {
    setSelectedFreq(freq);
    if (isPlaying) {
      playTone(freq);
    }
  };

  return (
    <TestShell
      test={test}
      stepIndex={stepIndex}
      total={TEST_REGISTRY.length}
      onPass={onPass}
      onFail={onFail}
      onSkip={onSkip}
    >
      <View style={styles.container}>
        {/* Pulsing Audio Core Ring */}
        <View style={styles.discWrapper}>
          <Animated.View
            style={[
              styles.pulseGlow,
              {
                transform: [{ scale: pulseAnim }],
                opacity: isPlaying ? 0.35 : 0,
              },
            ]}
          />
          <TouchableOpacity
            style={styles.playButton}
            onPress={isPlaying ? stopTone : () => playTone()}
            activeOpacity={0.8}
          >
            <GlassView
              intensity={isPlaying ? 60 : 35}
              style={[
                styles.playDiscGlass,
                isPlaying && styles.playDiscActive,
              ]}
            >
              <Ionicons
                name={isPlaying ? 'stop' : 'play'}
                size={38}
                color={isPlaying ? colors.systemGreen : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.playLabel,
                  isPlaying && { color: colors.systemGreen },
                ]}
              >
                {isPlaying ? 'Stop Output' : 'Play Sound'}
              </Text>
            </GlassView>
          </TouchableOpacity>
        </View>

        {/* Frequency Selector Matrix */}
        <View style={styles.freqMatrix}>
          {FREQUENCIES.map(f => {
            const isSelected = selectedFreq === f.freq;
            return (
              <TouchableOpacity
                key={f.freq}
                style={styles.freqTabWrapper}
                onPress={() => handleSelectFreq(f.freq)}
                activeOpacity={0.7}
              >
                <GlassView
                  intensity={isSelected ? 50 : 25}
                  style={[
                    styles.freqTab,
                    isSelected && styles.freqTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.freqTabTitle,
                      isSelected && styles.freqTabTitleActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                  <Text style={styles.freqTabSub}>{f.sub}</Text>
                </GlassView>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Audio Verification Status */}
        <GlassView intensity={30} style={styles.statusGlass}>
          <Ionicons
            name="volume-medium-outline"
            size={18}
            color={isPlaying ? colors.systemGreen : colors.textSecondary}
          />
          <Text style={styles.statusText}>
            {isPlaying
              ? `Acoustic waveform output active at ${selectedFreq} Hz`
              : 'Listen for audio clarity, rattling, or distortion'}
          </Text>
        </GlassView>
      </View>
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  discWrapper: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseGlow: {
    ...StyleSheet.absoluteFill,
    borderRadius: 85,
    backgroundColor: colors.systemGreen,
  },
  playButton: {
    width: 150,
    height: 150,
  },
  playDiscGlass: {
    flex: 1,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  playDiscActive: {
    borderColor: colors.systemGreen,
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
  },
  playLabel: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  freqMatrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    width: '100%',
  },
  freqTabWrapper: {
    width: '31%',
  },
  freqTab: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: radius.md,
    gap: 2,
  },
  freqTabActive: {
    borderColor: colors.systemGreen,
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
  },
  freqTabTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700' as const,
  },
  freqTabTitleActive: {
    color: colors.systemGreen,
  },
  freqTabSub: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textTertiary,
  },
  statusGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    gap: 8,
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
