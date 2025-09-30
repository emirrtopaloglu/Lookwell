import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TextStyleCardProps {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
}

export const TextStyleCard: React.FC<TextStyleCardProps> = ({
  title,
  description,
  prompt,
  icon,
  accentColor,
}) => {
  const router = useRouter();
  const background = useThemeColor({}, 'backgroundElevated');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const handlePress = () => {
    router.push({
      pathname: '/create',
      params: { prompt },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: background }, Elevations.level1]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
        <Ionicons name={icon} size={24} color={accentColor} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.description, { color: textSecondary }]} numberOfLines={2}>
          {description}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    padding: Spacing.md,
    borderRadius: Radii.md,
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.bodyStrong,
    marginBottom: Spacing['3xs'],
  },
  description: {
    ...Typography.caption,
  },
});

