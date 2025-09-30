import { Elevations, Radii, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

export const FloatingActionButton = () => {
  const router = useRouter();
  const accent = useThemeColor({}, 'accent');
  const iconOnAccent = useThemeColor({}, 'iconOnAccent');

  const handlePress = () => {
    router.push('/create');
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: accent },
        Elevations.level2,
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Ionicons name="sparkles" size={24} color={iconOnAccent} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.select({ ios: 24, android: 24, default: 24 }),
    right: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
});

