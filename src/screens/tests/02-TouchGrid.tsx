import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, typography } from '../../theme';
import { TestScreenProps } from '../../types';
import { TEST_REGISTRY } from '../../tests/registry';
import { TestShell } from '../../components/TestShell';
import { SuccessOverlay } from '../../components/SuccessOverlay';

const COLS = 6;
const ROWS = 9;
const TOTAL_TILES = COLS * ROWS;

export function TouchGridTest({ onPass, onFail, onSkip }: TestScreenProps) {
  const [activated, setActivated] = useState<Set<number>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const containerLayout = useRef({ width: 0, height: 0, x: 0, y: 0 });
  const passedRef = useRef(false);

  const test = TEST_REGISTRY.find(t => t.id === 'touch-grid')!;
  const stepIndex = TEST_REGISTRY.findIndex(t => t.id === 'touch-grid');

  const checkTileAtPoint = (touchX: number, touchY: number) => {
    const { width, height } = containerLayout.current;
    if (width === 0 || height === 0) return;

    const colWidth = width / COLS;
    const rowHeight = height / ROWS;

    const col = Math.floor(touchX / colWidth);
    const row = Math.floor(touchY / rowHeight);

    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      const index = row * COLS + col;
      setActivated(prev => {
        if (!prev.has(index)) {
          const next = new Set(prev);
          next.add(index);

          // Subtle tick haptic every few tiles
          if (next.size % 4 === 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          }

          // Auto-pass when 85% of tiles are responsive
          if (next.size >= Math.floor(TOTAL_TILES * 0.85) && !passedRef.current) {
            passedRef.current = true;
            setShowSuccess(true);
          }
          return next;
        }
        return prev;
      });
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        checkTileAtPoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderMove: evt => {
        checkTileAtPoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    containerLayout.current = { width, height, x: 0, y: 0 };
  };

  const percent = Math.round((activated.size / TOTAL_TILES) * 100);

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
        <View style={styles.headerRow}>
          <Text style={styles.instruction}>Glide your finger across all tiles</Text>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>

        {/* Matrix Area */}
        <View
          style={styles.gridContainer}
          onLayout={onLayout}
          {...panResponder.panHandlers}
        >
          {Array.from({ length: TOTAL_TILES }).map((_, i) => {
            const isFilled = activated.has(i);
            return (
              <View
                key={i}
                style={[
                  styles.tile,
                  isFilled ? styles.tileFilled : styles.tileEmpty,
                ]}
              />
            );
          })}
        </View>
      </View>

      <SuccessOverlay
        visible={showSuccess}
        title="Touch Screen Responsive"
        onFinish={onPass}
      />
    </TestShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  instruction: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  percentText: {
    ...typography.headline,
    color: colors.systemGreen,
    fontWeight: '700' as const,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    padding: 3,
  },
  tile: {
    width: `${100 / COLS}%` as any,
    height: `${100 / ROWS}%` as any,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 6,
  },
  tileEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  tileFilled: {
    backgroundColor: 'rgba(48, 209, 88, 0.75)',
    borderColor: colors.systemGreen,
    shadowColor: colors.systemGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
});
