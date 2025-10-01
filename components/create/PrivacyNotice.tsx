import { Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const PrivacyNotice: React.FC = () => {
  const successSoft = useThemeColor({}, 'successSoft');
  const success = useThemeColor({}, 'success');
  const textSecondary = useThemeColor({}, 'textSecondary');

  return (
    <View style={[styles.container, { backgroundColor: successSoft }]}>
      <Ionicons name="shield-checkmark" size={18} color={success} />
      <Text style={[styles.text, { color: textSecondary }]}>
        Your photos are processed instantly and not stored permanently. Your privacy is our priority.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.sm,
    marginBottom: Spacing.sm,
  },
  text: {
    ...Typography.caption,
    flex: 1,
    lineHeight: 16,
  },
});

