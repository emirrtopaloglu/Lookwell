import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DOT_SIZE = Math.max(8, SCREEN_WIDTH * 0.02);
const ACTIVE_DOT_WIDTH = DOT_SIZE * 3;

interface PaginationDotsProps {
  currentPage: number;
  totalPages: number;
}

interface DotProps {
  isActive: boolean;
  index: number;
}

function Dot({ isActive, index }: DotProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const widthAnim = useRef(new Animated.Value(isActive ? ACTIVE_DOT_WIDTH : DOT_SIZE)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: isActive ? ACTIVE_DOT_WIDTH : DOT_SIZE,
        useNativeDriver: false,
        friction: 8,
        tension: 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: isActive ? 1 : 0.4,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive, widthAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: widthAnim,
          height: DOT_SIZE,
          backgroundColor: isActive ? colors.accent : colors.iconMuted,
          opacity: opacityAnim,
        },
      ]}
    />
  );
}

export default function PaginationDots({
  currentPage,
  totalPages,
}: PaginationDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <Dot key={index} isActive={index === currentPage} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dot: {
    borderRadius: DOT_SIZE / 2,
  },
});
