import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { GlassView } from './GlassView';
import { colors, radius, typography } from '../theme';

interface Props {
  visible: boolean;
  title?: string;
  onFinish?: () => void;
  duration?: number;
}

export function SuccessOverlay({
  visible,
  title = 'Test Passed',
  onFinish,
  duration = 1000,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onFinish?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <GlassView intensity={65} style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Auto-advancing...</Text>
        </GlassView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  card: {
    width: 220,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(28, 28, 30, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.systemGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.systemGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    ...typography.headline,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  subtitle: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
