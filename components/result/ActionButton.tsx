import { Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ActionButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  iconName,
  label,
  onPress,
  variant = 'default',
}) => {
  const backgroundElevated = useThemeColor({}, 'backgroundElevated');
  const text = useThemeColor({}, 'text');
  const icon = useThemeColor({}, 'icon');
  const danger = useThemeColor({}, 'danger');

  const iconColor = variant === 'danger' ? danger : icon;
  const textColor = variant === 'danger' ? danger : text;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: backgroundElevated }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={iconName} size={24} color={iconColor} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.md,
    gap: Spacing['2xs'],
    minWidth: 80,
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
  },
});

