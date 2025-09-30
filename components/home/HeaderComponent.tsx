import { Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

interface HeaderComponentProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  subtitle,
  showGreeting = true,
}) => {
  const router = useRouter();
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');
  const icon = useThemeColor({}, 'icon');
  const background = useThemeColor({}, 'backgroundAlt');
  const border = useThemeColor({}, 'border');

  const greeting = useMemo(() => getGreeting(), []);

  const handleNotificationsPress = () => {
    // TODO: Navigate to notifications
    console.log('Notifications pressed');
  };

  const handleSettingsPress = () => {
    // TODO: Navigate to settings screen when implemented
    console.log('Settings pressed');
  };

  return (
    <View style={[styles.container, { backgroundColor: background, borderBottomColor: border }]}>
      <View style={styles.leftSection}>
        <View style={[styles.logoCircle, { backgroundColor: accent + '15' }]}>
          <Ionicons name="sparkles" size={20} color={accent} />
        </View>
        <View style={styles.greetingContainer}>
          {showGreeting && (
            <Text style={[styles.greeting, { color: textSecondary }]}>{greeting}</Text>
          )}
          {subtitle && (
            <Text style={[styles.greeting, { color: textSecondary }]}>{subtitle}</Text>
          )}
          <Text style={[styles.brandName, { color: text }]}>
            {title || 'Lookwell AI'}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={handleNotificationsPress}
          style={[styles.iconButton, { backgroundColor: icon + '08' }]}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color={icon} />
          <View style={[styles.badge, { backgroundColor: accent }]} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSettingsPress}
          style={[styles.iconButton, { backgroundColor: icon + '08' }]}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={22} color={icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...Typography.caption,
    marginBottom: Spacing['3xs'],
  },
  brandName: {
    ...Typography.title3,
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.full,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

