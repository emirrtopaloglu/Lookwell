import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEMO_WIDTH = SCREEN_WIDTH * 0.85;
const DEMO_HEIGHT = DEMO_WIDTH * 1.2;
const HANDLE_SIZE = 50;

interface DemoComponentProps {
  isActive: boolean;
}

export default function DemoComponent({ isActive }: DemoComponentProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const sliderPosition = useSharedValue(0);

  useEffect(() => {
    // Only start animation when page is active
    if (!isActive) {
      // Reset to beginning when not active
      sliderPosition.value = 0;
      return;
    }

    // Smooth easing configuration for natural motion
    const smoothEasing = Easing.bezier(0.25, 0.1, 0.25, 1); // Smooth ease-in-out
    
    // Start animation: Begin with "before" image (position 0)
    sliderPosition.value = 0;
    
    sliderPosition.value = withDelay(
      1000, // Initial pause to show "before" clearly (1 second)
      withRepeat(
        withSequence(
          // Smoothly reveal "after" image (2.5 seconds with smooth easing)
          withTiming(DEMO_WIDTH, { 
            duration: 2500, 
            easing: smoothEasing 
          }),
          // Hold at "after" to let user appreciate the transformation (1.5 seconds)
          withDelay(1500, withTiming(DEMO_WIDTH, { duration: 1 })),
          // Smoothly slide back to "before" (2.5 seconds)
          withTiming(0, { 
            duration: 2500, 
            easing: smoothEasing 
          }),
          // Hold at "before" before restarting cycle (1 second)
          withDelay(1000, withTiming(0, { duration: 1 }))
        ),
        -1, // Repeat infinitely
        false
      )
    );
  }, [isActive]);

  const afterImageStyle = useAnimatedStyle(() => ({
    width: sliderPosition.value,
  }));

  const handleStyle = useAnimatedStyle(() => ({
    left: sliderPosition.value - HANDLE_SIZE / 2,
  }));

  const dividerStyle = useAnimatedStyle(() => ({
    left: sliderPosition.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <View style={styles.labelItem}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Before</Text>
        </View>
        <View style={styles.labelItem}>
          <Text style={[styles.label, { color: colors.accent }]}>After</Text>
        </View>
      </View>

      <View
        style={[
          styles.imageContainer,
          { backgroundColor: colors.backgroundSunken },
        ]}
      >
        {/* Before Image (Base Layer) */}
        <Image
          source={require('@/assets/images/before.png')}
          style={styles.image}
          resizeMode="cover"
        />

        {/* After Image (Clipped Layer) */}
        <Animated.View style={[styles.afterImageContainer, afterImageStyle]}>
          <Image
            source={require('@/assets/images/after.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Divider Line */}
        <Animated.View
          style={[
            styles.divider,
            { backgroundColor: colors.accent },
            dividerStyle,
          ]}
        />

        {/* Handle */}
        <Animated.View
          style={[
            styles.handle,
            { backgroundColor: colors.accent },
            handleStyle,
          ]}
        >
          <Ionicons name="chevron-back" size={18} color={colors.textOnAccent} />
          <Ionicons name="chevron-forward" size={18} color={colors.textOnAccent} />
        </Animated.View>
      </View>

      <View style={styles.instructionContainer}>
        <Ionicons name="eye-outline" size={20} color={colors.accent} />
        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          Watch the AI transformation
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DEMO_WIDTH,
    paddingHorizontal: Spacing.sm,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2xs'],
  },
  label: {
    ...Typography.caption,
    fontSize: Math.min(Typography.caption.fontSize, SCREEN_WIDTH * 0.032),
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  imageContainer: {
    width: DEMO_WIDTH,
    height: DEMO_HEIGHT,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: DEMO_WIDTH,
    height: DEMO_HEIGHT,
  },
  afterImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  divider: {
    position: 'absolute',
    top: 0,
    width: 3,
    height: '100%',
  },
  handle: {
    position: 'absolute',
    top: '50%',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    marginTop: -HANDLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  instruction: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.035),
  },
});
