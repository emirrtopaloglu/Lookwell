import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface InspirationCardProps {
  id: string;
  title: string;
  prompt: string;
  imageUri: string;
  modelId?: string;
}

export const InspirationCard: React.FC<InspirationCardProps> = ({
  id,
  title,
  prompt,
  imageUri,
  modelId,
}) => {
  const router = useRouter();
  const textOnAccent = useThemeColor({}, 'textOnAccent');

  const handlePress = () => {
    router.push({
      pathname: '/create',
      params: { prompt, modelId },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, Elevations.level1]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: imageUri }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
          style={styles.overlay}
        >
          <Text style={[styles.title, { color: textOnAccent }]} numberOfLines={2}>
            {title}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: Spacing.xs,
    borderRadius: Radii.sm,
    overflow: 'hidden',
    aspectRatio: 0.8,
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    borderRadius: Radii.md,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.sm,
  },
  title: {
    ...Typography.bodyStrong,
  },
});

