import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  leftIcon,
  rightIcon,
  style,
  size = 'md',
}) => {
  const text = useThemeColor({}, 'text');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'tint');

  const paddingY = size === 'sm' ? Spacing['2xs'] : Spacing.sm;
  const paddingX = size === 'sm' ? Spacing.sm : Spacing.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          paddingVertical: paddingY,
          paddingHorizontal: paddingX,
          borderColor: selected ? primary : border,
          backgroundColor: selected ? primary : 'transparent',
        },
        style,
      ]}
    >
      {leftIcon}
      <Text style={[styles.label, { color: selected ? Colors.white : text }]}>{label}</Text>
      {rightIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 2,
    borderRadius: 20,
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
  },
});


