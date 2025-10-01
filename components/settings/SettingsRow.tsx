import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingsRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  rightElement?: React.ReactNode;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  iconName,
  label,
  onPress,
  destructive = false,
  rightElement,
}) => {
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const danger = useThemeColor({}, 'danger');
  const border = useThemeColor({}, 'border');

  const iconColor = destructive ? danger : textSecondary;
  const textColor = destructive ? danger : text;

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Ionicons name={iconName} size={22} color={iconColor} />
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </View>
      
      <View style={styles.rightContent}>
        {rightElement || <Ionicons name="chevron-forward" size={20} color={textSecondary} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    ...Typography.body,
  },
});

