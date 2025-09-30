import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import DemoComponent from '@/components/onboarding/DemoComponent';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DemoPageProps {
  isActive: boolean;
}

export default function DemoPage({ isActive }: DemoPageProps) {
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
            Transform your look instantly
          </Text>
        </View>

        <View style={styles.demoSection}>
          <DemoComponent isActive={isActive} />
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
    marginBottom: Spacing.md,
  },
  demoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
