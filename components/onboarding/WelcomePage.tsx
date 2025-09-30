import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_SIZE = Math.min(SCREEN_WIDTH * 0.6, 280);

export default function WelcomePage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.pageContainer, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={[styles.imageContainer, { backgroundColor: colors.accentSoft }]}>
            <LottieView
              source={require('@/assets/Wardrobe.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
        </View>

        <View style={styles.textSection}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Welcome to Lookwell AI
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Try on any outfit, instantly.
            </Text>
            <Text style={[styles.description, { color: colors.textMuted }]}>
              Transform your shopping experience with AI-powered virtual try-ons. See how any style looks on you before you buy.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: SCREEN_HEIGHT * 0.08,
    paddingBottom: SCREEN_HEIGHT * 0.15,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: Radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  textSection: {
    flex: 0.45,
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    ...Typography.display,
    fontSize: Math.min(Typography.display.fontSize, SCREEN_WIDTH * 0.095),
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.title3,
    fontSize: Math.min(Typography.title3.fontSize, SCREEN_WIDTH * 0.052),
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    fontSize: Math.min(Typography.body.fontSize, SCREEN_WIDTH * 0.04),
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 22,
    maxWidth: SCREEN_WIDTH * 0.85,
  },
});
