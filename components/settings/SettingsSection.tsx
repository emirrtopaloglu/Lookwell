import { Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  const text = useThemeColor({}, 'text');
  const backgroundElevated = useThemeColor({}, 'backgroundElevated');

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: text }]}>{title}</Text>
      <View style={[styles.content, { backgroundColor: backgroundElevated }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.bodySmall,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.md,
    opacity: 0.6,
  },
  content: {
    borderRadius: Radii.md,
    overflow: 'hidden',
  },
});

