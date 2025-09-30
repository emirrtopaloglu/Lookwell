import { Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PromptPreviewProps {
  prompt: string;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({ prompt }) => {
  const background = useThemeColor({}, 'backgroundSunken');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');

  if (!prompt) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textSecondary }]}>Prompt to Generate:</Text>
      <View style={[styles.previewBox, { backgroundColor: background }]}>
        <Text style={[styles.promptText, { color: text }]}>{prompt}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  label: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  previewBox: {
    padding: Spacing.md,
    borderRadius: Radii.md,
  },
  promptText: {
    ...Typography.body,
  },
});

