import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PremiumFeature {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

interface PremiumFeatureItemProps {
  feature: PremiumFeature;
}

export default function PremiumFeatureItem({ feature }: PremiumFeatureItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundElevated, borderColor: colors.border },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name={feature.icon} size={24} color={colors.accent} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {feature.title}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {feature.description}
        </Text>
      </View>
      <Ionicons name="checkmark-circle" size={24} color={colors.success} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.bodyStrong,
    fontSize: Math.min(Typography.bodyStrong.fontSize, SCREEN_WIDTH * 0.04),
    marginBottom: 2,
  },
  description: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.032),
  },
});
