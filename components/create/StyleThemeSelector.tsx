import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StyleThemeSelectorProps {
  onPress: () => void;
  hasSelection: boolean;
}

export const StyleThemeSelector: React.FC<StyleThemeSelectorProps> = ({
  onPress,
  hasSelection,
}) => {
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');
  const accentSoft = useThemeColor({}, 'accentSoft');
  const backgroundElevated = useThemeColor({}, 'backgroundElevated');
  const border = useThemeColor({}, 'border');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: hasSelection ? accentSoft : backgroundElevated,
            borderColor: hasSelection ? accent : border,
          },
          Platform.OS === 'ios' && Elevations.level2,
        ]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <View style={[styles.iconContainer, { backgroundColor: hasSelection ? accent + '20' : accent + '10' }]}>
          <Ionicons
            name="sparkles"
            size={28}
            color={hasSelection ? accent : text}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              { color: hasSelection ? accent : text },
            ]}
          >
            {hasSelection ? 'Style Theme Selected ✓' : 'Browse Style Inspirations'}
          </Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>
            {hasSelection
              ? 'Tap to change or explore more styles'
              : 'Choose from curated fashion themes'}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={hasSelection ? accent : textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radii.xl,
    borderWidth: 2,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.bodyStrong,
    fontSize: 16,
    marginBottom: Spacing['3xs'],
  },
  subtitle: {
    ...Typography.caption,
    lineHeight: 16,
  },
});

