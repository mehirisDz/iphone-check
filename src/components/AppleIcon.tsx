import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

interface Props {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  badgeSize?: number;
  badgeColor?: string;
  style?: ViewStyle;
}

export function AppleIcon({
  name,
  size = 22,
  color = '#FFFFFF',
  badgeSize = 44,
  badgeColor = 'rgba(255, 255, 255, 0.08)',
  style,
}: Props) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize * 0.28,
          backgroundColor: badgeColor,
        },
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
});
