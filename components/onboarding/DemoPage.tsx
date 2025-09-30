import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.featureItem}>
      <View style={[styles.iconContainer, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name={icon} size={28} color={colors.accent} />
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

export default function DemoPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.pageContainer, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            See the Magic
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Experience the future of fashion
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <FeatureItem
            icon="camera"
            title="Upload Your Photo"
            description="Take a selfie or choose from your gallery"
          />
          <FeatureItem
            icon="sparkles"
            title="AI-Powered Magic"
            description="Our AI instantly tries outfits on you"
          />
          <FeatureItem
            icon="heart"
            title="Find Your Style"
            description="Discover what looks best on you"
          />
        </View>

        <View style={[styles.demoPlaceholder, { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}>
          <Ionicons name="play-circle" size={64} color={colors.accent} />
          <Text style={[styles.placeholderText, { color: colors.text }]}>
            Demo Video
          </Text>
          <Text style={[styles.placeholderSubtext, { color: colors.textSecondary }]}>
            Coming soon
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: SCREEN_HEIGHT * 0.08,
    paddingBottom: SCREEN_HEIGHT * 0.15,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.display,
    fontSize: Math.min(Typography.display.fontSize, SCREEN_WIDTH * 0.095),
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.title3,
    fontSize: Math.min(Typography.title3.fontSize, SCREEN_WIDTH * 0.045),
    textAlign: 'center',
  },
  featuresSection: {
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
    gap: Spacing['2xs'],
    paddingTop: Spacing['2xs'],
  },
  featureTitle: {
    ...Typography.bodyStrong,
    fontSize: Math.min(Typography.bodyStrong.fontSize, SCREEN_WIDTH * 0.042),
  },
  featureDescription: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.037),
    lineHeight: 20,
  },
  demoPlaceholder: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.22,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  placeholderText: {
    ...Typography.title3,
    fontSize: Math.min(Typography.title3.fontSize, SCREEN_WIDTH * 0.05),
    marginTop: Spacing.xs,
  },
  placeholderSubtext: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.035),
  },
});
