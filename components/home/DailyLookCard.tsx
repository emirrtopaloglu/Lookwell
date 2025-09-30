import { getTodaysTheme } from '@/constants/style-themes';
import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';

export const StyleSpotlightCard = () => {
  const router = useRouter();
  const text = useThemeColor({}, 'text');
  const textOnAccent = useThemeColor({}, 'textOnAccent');
  const accent = useThemeColor({}, 'accent');
  const accentSoft = useThemeColor({}, 'accentSoft');

  const todaysTheme = useMemo(() => getTodaysTheme(), []);

  const handlePress = () => {
    router.push({
      pathname: '/create',
      params: { prompt: todaysTheme.prompt },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, Elevations.level2]}
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <ImageBackground
        source={{ uri: todaysTheme.imageUri }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.7)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}
        >
          <Text style={[styles.label, { color: textOnAccent }]}>Style Spotlight</Text>
          <Text style={[styles.title, { color: textOnAccent }]}>{todaysTheme.title}</Text>
          <Text style={[styles.subtitle, { color: textOnAccent }]}>
            {todaysTheme.subtitle}
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: accent }]}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: textOnAccent }]}>
              Try This Style
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    height: 200,
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    borderRadius: Radii.lg,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  label: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing['3xs'],
    opacity: 0.9,
  },
  title: {
    ...Typography.title2,
    marginBottom: Spacing['3xs'],
  },
  subtitle: {
    ...Typography.bodySmall,
    marginBottom: Spacing.md,
    opacity: 0.9,
  },
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    ...Typography.button,
  },
});

