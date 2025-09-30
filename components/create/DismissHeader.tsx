import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DismissHeaderProps {
  title: string;
}

export const DismissHeader: React.FC<DismissHeaderProps> = ({ title }) => {
  const router = useRouter();
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const background = useThemeColor({}, 'backgroundAlt');
  const border = useThemeColor({}, 'border');

  const handleDismiss = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: background, borderBottomColor: border }]}>
      <TouchableOpacity
        onPress={handleDismiss}
        style={styles.dismissButton}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-down" size={28} color={textSecondary} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: text }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Removed right button - main action is at bottom */}
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    height: 56,
    borderBottomWidth: 1,
  },
  dismissButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.title3,
  },
  spacer: {
    width: 44,
  },
});

