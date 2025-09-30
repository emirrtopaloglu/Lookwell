import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SubscriptionCardProps {
  isPro: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ isPro }) => {
  const router = useRouter();
  const textOnAccent = useThemeColor({}, 'textOnAccent');
  const accent = useThemeColor({}, 'accent');
  const backgroundElevated = useThemeColor({}, 'backgroundElevated');

  const handlePress = () => {
    if (isPro) {
      // TODO: Navigate to subscription management
      console.log('Manage subscription');
    } else {
      router.push('/paywall');
    }
  };

  if (isPro) {
    return (
      <View style={[styles.container, { backgroundColor: backgroundElevated }, Elevations.level1]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="sparkles" size={24} color={accent} />
            <Text style={[styles.title, { color: accent }]}>
              You are a Pro Member ✨
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: textOnAccent }]}>
            You have access to all features
          </Text>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: accent + '20', borderColor: accent }]}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: accent }]}>
              Manage Subscription
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, Elevations.level2]}
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <LinearGradient
        colors={['#14B8A6', '#0D9488', '#0F766E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="diamond" size={28} color="#fff" />
            <Text style={[styles.title, { color: '#fff' }]}>
              Upgrade to Lookwell AI Pro
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.9)' }]}>
            Unlimited tries in HD quality without watermark
          </Text>
          
          <View style={[styles.button, { backgroundColor: '#fff' }]}>
            <Text style={[styles.buttonText, { color: '#0F766E' }]}>
              Upgrade to Pro
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#0F766E" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: Radii.lg,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.title3,
    flex: 1,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonText: {
    ...Typography.button,
  },
});

