import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface GenerateButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
}) => {
  const accent = useThemeColor({}, 'accent');
  const textOnAccent = useThemeColor({}, 'textOnAccent');
  const backgroundSunken = useThemeColor({}, 'backgroundSunken');
  const textMuted = useThemeColor({}, 'textMuted');

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDisabled ? backgroundSunken : accent,
          opacity: isDisabled ? 0.5 : 1,
        },
        !isDisabled && Elevations.level1,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={textOnAccent} />
      ) : (
        <Text style={[styles.buttonText, { color: isDisabled ? textMuted : textOnAccent }]}>
          Generate Look
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonText: {
    ...Typography.button,
    fontSize: 18,
  },
});

