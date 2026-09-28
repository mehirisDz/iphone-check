import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { GlassView } from '../../components/GlassView';
import { SuccessOverlay } from '../../components/SuccessOverlay';

function getHeading(x: number, y: number): number {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  angle = (angle + 360) % 360;
  return Math.round(angle);
}

const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
function getCardinal(deg: number) {
  return CARDINALS[Math.round(deg / 45) % 8];
}

const DIAL_SIZE = 240;
const RADIUS = DIAL_SIZE / 2;

export function CompassTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [heading, setHeading] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const prevHeading = useRef(0);
  const accumulatedRotation = useRef(0);
  const passedRef = useRef(false);

  const test = TEST_REGISTRY.find(t => t.id === 'compass')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'compass');

  useEffect(() => {
    Magnetometer.setUpdateInterval(50);
    const sub = Magnetometer.addListener(data => {
      const h = getHeading(data.x, data.y);
      const diff = Math.abs(h - prevHeading.current);
      if (diff < 180) {
        accumulatedRotation.current += diff;
      }
      prevHeading.current = h;
      setHeading(h);

      if (accumulatedRotation.current > 70 && !passedRef.current) {
        passedRef.current = true;
        setShowSuccess(true);
      }
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: -heading,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [heading]);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

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
        {/* Main Heading Display */}
        <View style={styles.headingBox}>
          <Text style={styles.degreeText}>{heading}°</Text>
          <Text style={styles.cardinalText}>{getCardinal(heading)}</Text>
        </View>

        {/* Apple Compass Rose Dial */}
        <View style={styles.dialWrapper}>
          <Animated.View
            style={[
              styles.dial,
              { transform: [{ rotate: rotateInterpolation }] },
            ]}
          >
            <Svg width={DIAL_SIZE} height={DIAL_SIZE}>
              <Circle
                cx={RADIUS}
                cy={RADIUS}
                r={RADIUS - 4}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth={1}
                fill="none"
              />

              {/* Dial Ticks */}
              {Array.from({ length: 72 }).map((_, i) => {
                const angle = (i * 5 * Math.PI) / 180;
                const isMajor = i % 6 === 0; // Every 30 degrees
                const tickLen = isMajor ? 12 : 6;
                const x1 = RADIUS + (RADIUS - 16) * Math.sin(angle);
                const y1 = RADIUS - (RADIUS - 16) * Math.cos(angle);
                const x2 = RADIUS + (RADIUS - 16 - tickLen) * Math.sin(angle);
                const y2 = RADIUS - (RADIUS - 16 - tickLen) * Math.cos(angle);

                return (
                  <Line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      i === 0
                        ? colors.systemRed
                        : isMajor
                        ? 'rgba(255, 255, 255, 0.8)'
                        : 'rgba(255, 255, 255, 0.25)'
                    }
                    strokeWidth={isMajor ? 2 : 1}
                  />
                );
              })}

              {/* Cardinal Labels */}
              <SvgText
                x={RADIUS}
                y={RADIUS - 52}
                fill={colors.systemRed}
                fontSize={16}
                fontWeight="bold"
                textAnchor="middle"
              >
                N
              </SvgText>
              <SvgText
                x={RADIUS + 58}
                y={RADIUS + 5}
                fill="#FFFFFF"
                fontSize={14}
                fontWeight="600"
                textAnchor="middle"
              >
                E
              </SvgText>
              <SvgText
                x={RADIUS}
                y={RADIUS + 66}
                fill="#FFFFFF"
                fontSize={14}
                fontWeight="600"
                textAnchor="middle"
              >
                S
              </SvgText>
              <SvgText
                x={RADIUS - 58}
                y={RADIUS + 5}
                fill="#FFFFFF"
                fontSize={14}
                fontWeight="600"
                textAnchor="middle"
              >
                W
              </SvgText>
            </Svg>
          </Animated.View>

          {/* Fixed Needle Pointer at Top */}
          <View style={styles.fixedPointer} />

          {/* Crosshair Level Indicator */}
          <View style={styles.crosshair}>
            <View style={styles.crosshairLineH} />
            <View style={styles.crosshairLineV} />
            <View style={styles.crosshairCenter} />
          </View>
        </View>

        {/* Ambient Hardware Status Card */}
        <GlassView intensity={35} style={styles.statusGlass}>
          <Text style={styles.statusTitle}>Magnetometer Active</Text>
          <Text style={styles.statusSub}>
            Rotate phone to verify magnetic compass sensor
          </Text>
        </GlassView>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="Compass Verified"
        onFinish={onPass}
      />
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  headingBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  degreeText: {
    ...typography.metric,
    color: '#FFFFFF',
  },
  cardinalText: {
    ...typography.title1,
    color: colors.textSecondary,
    fontWeight: '700' as const,
  },
  dialWrapper: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dial: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
  },
  fixedPointer: {
    position: 'absolute',
    top: 4,
    width: 3,
    height: 14,
    borderRadius: 1.5,
    backgroundColor: colors.systemRed,
  },
  crosshair: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairLineH: {
    position: 'absolute',
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  crosshairLineV: {
    position: 'absolute',
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  crosshairCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  statusGlass: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    gap: 2,
  },
  statusTitle: {
    ...typography.footnote,
    color: colors.systemGreen,
    fontWeight: '700' as const,
  },
  statusSub: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
