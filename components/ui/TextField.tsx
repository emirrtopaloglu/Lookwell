import React from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  containerStyle?: object;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  errorText,
  leftAccessory,
  rightAccessory,
  containerStyle,
  ...inputProps
}) => {
  const text = useThemeColor({}, 'text');
  const textMuted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const danger = useThemeColor({}, 'danger');
  const background = useThemeColor({}, 'backgroundAlt');

  const showError = !!errorText;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: text }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          { borderColor: showError ? danger : border, backgroundColor: background },
        ]}
      >
        {leftAccessory ? <View style={styles.accessory}>{leftAccessory}</View> : null}
        <TextInput
          style={[
            styles.input,
            { color: text },
            Platform.select({
              android: { paddingTop: 14, paddingBottom: 14 },
              default: { paddingVertical: Spacing.sm },
            }) as object,
          ]}
          placeholderTextColor={textMuted}
          selectionColor={text}
          textAlignVertical="center"
          underlineColorAndroid="transparent"
          multiline={false}
          numberOfLines={1}
          {...(Platform.OS === 'android' ? { includeFontPadding: false as unknown as undefined } : {})}
          {...inputProps}
        />
        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>

      {showError ? (
        <Text style={[styles.errorText, { color: danger }]}>{errorText}</Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: textMuted }]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing['2xs'],
  },
  label: {
    ...Typography.label,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  input: {
    ...Typography.body,
    flex: 1,
    minHeight: 52,
  },
  accessory: {
    marginHorizontal: Spacing.xs,
  },
  helperText: {
    ...Typography.caption,
  },
  errorText: {
    ...Typography.caption,
  },
});



