import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { UserProfile } from '@/types/profile';

interface ProfileCardProps {
  profile?: UserProfile;
  isLoading?: boolean;
  onEditPress?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  isLoading = false,
  onEditPress,
}) => {
  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const text = useThemeColor({}, 'text');
  const textMuted = useThemeColor({}, 'textMuted');
  const primary = useThemeColor({}, 'tint');

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: surface }]}>
        <ActivityIndicator size="small" color={primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: surface }]}>
        <Text style={[styles.noProfileText, { color: textMuted }]}>
          Profile not set
        </Text>
      </View>
    );
  }

  const genderEmoji = {
    male: '👨',
    female: '👩',
    'non-binary': '🧑',
    'prefer-not-to-say': '✨',
  }[profile.gender];

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{genderEmoji}</Text>
        </View>
        
        <View style={styles.info}>
          <Text style={[styles.name, { color: text }]}>{profile.displayName}</Text>
          
          <View style={styles.details}>
            {profile.ageRange && (
              <View style={[styles.badge, { backgroundColor: background }]}>
                <Text style={[styles.badgeText, { color: textMuted }]}>
                  {profile.ageRange}
                </Text>
              </View>
            )}
            
            {profile.stylePreferences && profile.stylePreferences.length > 0 && (
              <View style={[styles.badge, { backgroundColor: background }]}>
                <Text style={[styles.badgeText, { color: textMuted }]}>
                  {profile.stylePreferences.length} style{profile.stylePreferences.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {onEditPress && (
        <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color={primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: 16,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatar: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  details: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing['2xs'],
    borderRadius: 12,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 12,
  },
  noProfileText: {
    ...Typography.body,
  },
  editButton: {
    padding: Spacing.sm,
  },
});

