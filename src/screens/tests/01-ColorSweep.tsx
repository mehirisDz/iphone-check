import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

const COLORS = [
  '#FF3B30', // Apple Red
  '#FF9F0A', // Apple Orange
  '#FFD60A', // Apple Yellow
  '#30D158', // Apple Green
  '#64D2FF', // Apple Cyan
  '#0A84FF', // Apple Blue
  '#BF5AF2', // Apple Purple
  '#FFFFFF', // Pure White (OLED Uniformity)
  '#000000', // True Black (Dead Pixels / Backlight Bleed)
];

const COLOR_NAMES = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Purple', 'White', 'Black'];

export function ColorSweepTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [colorIdx, setColorIdx] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (colorIdx < COLORS.length - 1) {
      setColorIdx(prev => prev + 1);
    } else {
      setShowSuccess(true);
    }
  };

  const isLight = colorIdx === 7 || colorIdx === 2;

  return (
    <View style={[styles.container, { backgroundColor: COLORS[colorIdx] }]}>
      <StatusBar
        barStyle={isLight ? 'dark-content' : 'light-content'}
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={styles.safe}>
        {/* Floating Top Capsule */}
        <View style={styles.topBar}>
          <GlassView intensity={50} style={styles.capsule}>
            <Text style={[styles.colorName, isLight && styles.textDark]}>
              {COLOR_NAMES[colorIdx]} · {colorIdx + 1}/{COLORS.length}
            </Text>
          </GlassView>
          <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
            <Text style={[styles.skipText, isLight && styles.textDark]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Center Tap Area Prompt */}
        <TouchableOpacity
          style={styles.tapArea}
          onPress={handleNext}
          activeOpacity={1}
        >
          <GlassView intensity={30} style={styles.hintGlass}>
            <Text style={[styles.hintText, isLight && styles.textDark]}>
              Tap screen to cycle colors · Inspect for dead pixels
            </Text>
          </GlassView>
        </TouchableOpacity>

        {/* Floating Bottom Control Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.dotsRow}>
            {COLORS.map((c, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setColorIdx(i);
                }}
                style={[
                  styles.dot,
                  { backgroundColor: c },
                  i === colorIdx && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btn, styles.btnFail]}
              onPress={onFail}
              activeOpacity={0.8}
            >
              <Text style={styles.btnFailText}>Found Issue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnPass]}
              onPress={() => setShowSuccess(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnPassText}>Display Clean</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <SuccessOverlay
        visible={showSuccess}
        title="Display Pixels Clean"
        onFinish={onPass}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  capsule: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  colorName: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  skipBtn: {
    padding: 8,
  },
  skipText: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600' as const,
  },
  textDark: {
    color: '#000000',
  },
  tapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  hintGlass: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
  },
  hintText: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    transform: [{ scale: 1.4 }],
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPass: {
    backgroundColor: colors.systemGreen,
    shadowColor: colors.systemGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  btnPassText: {
    ...typography.headline,
    color: '#000000',
    fontWeight: '700' as const,
  },
  btnFail: {
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.35)',
  },
  btnFailText: {
    ...typography.headline,
    color: colors.systemRed,
    fontWeight: '600' as const,
  },
});
