import { Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface ClothingInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const ClothingInput: React.FC<ClothingInputProps> = ({
  value,
  onChangeText,
  placeholder = 'E.g: Red dress',
}) => {
  const background = useThemeColor({}, 'backgroundElevated');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const border = useThemeColor({}, 'border');

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textSecondary }]}>or describe with text:</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: background, borderColor: border, color: text },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={textSecondary}
        multiline
        numberOfLines={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    marginBottom: Spacing['2xs'],
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: Radii.sm,
    padding: Spacing.sm,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

