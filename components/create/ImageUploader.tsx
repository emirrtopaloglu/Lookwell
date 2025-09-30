import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageUploaderProps {
  label: string;
  imageUri?: string;
  onPress: () => void;
  placeholder?: string;
  hint?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  imageUri,
  onPress,
  placeholder = 'Upload Photo',
  hint,
}) => {
  const background = useThemeColor({}, 'backgroundElevated');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const textMuted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: text }]}>{label}</Text>
        {hint && (
          <Text style={[styles.hint, { color: textMuted }]}>{hint}</Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[
          styles.uploadArea,
          { backgroundColor: background, borderColor: border },
          Elevations.level1,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContent}>
            <View style={[styles.iconContainer, { backgroundColor: accent + '15' }]}>
              <Ionicons name="images-outline" size={32} color={accent} />
            </View>
            <Text style={[styles.placeholderText, { color: textSecondary }]}>
              {placeholder}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelContainer: {
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.bodyStrong,
    marginBottom: Spacing['3xs'],
  },
  hint: {
    ...Typography.caption,
    fontStyle: 'italic',
  },
  uploadArea: {
    height: 200,
    borderRadius: Radii.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: Radii.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...Typography.bodySmall,
  },
});

