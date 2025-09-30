import { Radii } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface BeforeAfterSliderProps {
  beforeImageUri: string;
  afterImageUri: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImageUri,
  afterImageUri,
}) => {
  const accent = useThemeColor({}, 'accent');
  const [containerWidth, setContainerWidth] = useState(0);
  const sliderPosition = useSharedValue(50); // Start at 50% (in percentage)
  const startPosition = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      startPosition.value = sliderPosition.value;
    })
    .onUpdate((event) => {
      if (containerWidth === 0) return;
      
      // Calculate new position based on translation
      const deltaPercentage = (event.translationX / containerWidth) * 100;
      const newPosition = startPosition.value + deltaPercentage;
      
      // Clamp between 0 and 100
      sliderPosition.value = Math.max(0, Math.min(100, newPosition));
    })
    .onEnd(() => {
      // Optional: Snap to common positions
      if (sliderPosition.value < 15) {
        sliderPosition.value = withSpring(0);
      } else if (sliderPosition.value > 85) {
        sliderPosition.value = withSpring(100);
      }
    });

  const afterImageContainerStyle = useAnimatedStyle(() => ({
    width: `${sliderPosition.value}%`,
  }));

  const sliderHandleStyle = useAnimatedStyle(() => ({
    left: `${sliderPosition.value}%`,
  }));

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Before Image (Full Background) */}
      <Image 
        source={{ uri: beforeImageUri }} 
        style={styles.image}
        resizeMode="cover"
      />

      {/* After Image (Clipped by animated container) */}
      <Animated.View style={[styles.afterContainer, afterImageContainerStyle]}>
        <Image
          source={{ uri: afterImageUri }}
          style={[styles.afterImage, { width: containerWidth || '100%' }]}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Slider Handle - Gesture Area */}
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sliderHandle, sliderHandleStyle]}>
          {/* Vertical Line */}
          <View style={[styles.handleLine, { backgroundColor: accent }]} />
          
          {/* Draggable Circle */}
          <View style={[styles.handleCircle, { backgroundColor: accent }]}>
            <View style={styles.handleInner}>
              {/* Left Arrow */}
              <View style={styles.arrowLeft} />
              {/* Right Arrow */}
              <View style={styles.arrowRight} />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
    borderRadius: Radii.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  afterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  afterImage: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 44, // Wider touch target
    marginLeft: -22, // Center it
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleLine: {
    position: 'absolute',
    width: 3,
    height: '100%',
    top: 0,
  },
  handleCircle: {
    position: 'absolute',
    top: '50%',
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  handleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  arrowLeft: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 7,
    borderRightWidth: 9,
    borderBottomWidth: 7,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: 'white',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arrowRight: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 7,
    borderRightWidth: 0,
    borderBottomWidth: 7,
    borderLeftWidth: 9,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
  },
});

