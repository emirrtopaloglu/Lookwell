import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  onPress,
}) => {
  const background = useThemeColor({}, 'backgroundElevated');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: background }, Elevations.level1]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconCircle, { backgroundColor: accent + '15' }]}>
        <Ionicons name={icon} size={28} color={accent} />
      </View>
      <Text style={[styles.title, { color: text }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.description, { color: textSecondary }]} numberOfLines={2}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radii.md,
    alignItems: 'center',
    minHeight: 140,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.bodyStrong,
    marginBottom: Spacing['3xs'],
    textAlign: 'center',
  },
  description: {
    ...Typography.caption,
    textAlign: 'center',
  },
});

