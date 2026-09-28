import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius } from '../theme';

interface Props {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default' | 'systemUltraThinMaterialDark' | 'systemThinMaterialDark' | 'systemMaterialDark' | 'systemThickMaterialDark' | 'systemChromeMaterialDark';
}

export function GlassView({ children, style, intensity = 45, tint = 'dark' }: Props) {
  return (
    <BlurView intensity={intensity} tint={tint} style={[styles.glass, style]}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
});
