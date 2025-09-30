import React from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GetStartedPageProps {
  onGetStarted: () => void;
}

interface BenefitItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

function BenefitItem({ icon, text }: BenefitItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.benefitItem}>
      <View style={[styles.checkContainer, { backgroundColor: colors.successSoft }]}>
        <Ionicons name={icon} size={20} color={colors.success} />
      </View>
      <Text style={[styles.benefitText, { color: colors.text }]}>
        {text}
      </Text>
    </View>
  );
}

export default function GetStartedPage({ onGetStarted }: GetStartedPageProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.pageContainer, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={[styles.celebrationContainer, { backgroundColor: colors.accentSoft }]}>
            <Ionicons name="checkmark-circle" size={80} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            You're All Set!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Start your style journey today
          </Text>
        </View>

        <View style={styles.benefitsSection}>
          <BenefitItem
            icon="flash"
            text="Instant virtual try-ons"
          />
          <BenefitItem
            icon="infinite"
            text="Unlimited style possibilities"
          />
          <BenefitItem
            icon="shield-checkmark"
            text="Your photos stay private"
          />
          <BenefitItem
            icon="trending-up"
            text="Find what truly suits you"
          />
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.accent },
              Platform.OS === 'ios' && Elevations.level2,
            ]}
            onPress={onGetStarted}
            activeOpacity={0.85}
          >
            <Text style={[styles.buttonText, { color: colors.textOnAccent }]}>
              Get Started
            </Text>
            <Ionicons name="arrow-forward" size={22} color={colors.textOnAccent} />
          </TouchableOpacity>
          <Text style={[styles.freeTrialText, { color: colors.textMuted }]}>
            Start with 2 free trials — no credit card required
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
    gap: Spacing.md,
  },
  celebrationContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
  benefitsSection: {
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    ...Typography.body,
    fontSize: Math.min(Typography.body.fontSize, SCREEN_WIDTH * 0.042),
    flex: 1,
  },
  actionSection: {
    gap: Spacing.md,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['3xl'],
    borderRadius: Radii.lg,
    width: '100%',
    minHeight: 56,
  },
  buttonText: {
    ...Typography.button,
    fontSize: Math.min(18, SCREEN_WIDTH * 0.048),
  },
  freeTrialText: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.035),
    textAlign: 'center',
  },
});
