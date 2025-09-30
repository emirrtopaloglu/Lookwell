import React from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Welcome back!
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Ready to Try On?
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.backgroundElevated }]}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle-outline" size={32} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={[styles.heroCard, { backgroundColor: colors.accent }, Platform.OS === 'ios' && Elevations.level2]}>
        <View style={styles.heroContent}>
          <Ionicons name="camera" size={48} color={colors.textOnAccent} />
          <Text style={[styles.heroTitle, { color: colors.textOnAccent }]}>
            Start Your First Try-On
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textOnAccent }]}>
            Upload a photo and see the magic happen
          </Text>
          <TouchableOpacity
            style={[styles.heroButton, { backgroundColor: colors.textOnAccent }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.heroButtonText, { color: colors.accent }]}>
              Upload Photo
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }, Platform.OS === 'ios' && Elevations.level1]}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="images" size={24} color={colors.accent} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              My Gallery
            </Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
              View saved looks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }, Platform.OS === 'ios' && Elevations.level1]}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: colors.infoSoft }]}>
              <Ionicons name="sparkles" size={24} color={colors.info} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              Style Packs
            </Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
              Browse collections
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Try-Ons
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.accent }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.emptyState, { backgroundColor: colors.backgroundSunken }]}>
          <Ionicons name="shirt-outline" size={48} color={colors.iconMuted} />
          <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
            No try-ons yet. Start your first one!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? Spacing['3xl'] + 20 : Spacing.xl,
    paddingBottom: Spacing['3xl'],
    gap: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  greeting: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.035),
    marginBottom: Spacing['2xs'],
  },
  title: {
    ...Typography.title1,
    fontSize: Math.min(Typography.title1.fontSize, SCREEN_WIDTH * 0.08),
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    marginVertical: Spacing.sm,
  },
  heroContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroTitle: {
    ...Typography.title2,
    fontSize: Math.min(Typography.title2.fontSize, SCREEN_WIDTH * 0.06),
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.body,
    fontSize: Math.min(Typography.body.fontSize, SCREEN_WIDTH * 0.04),
    textAlign: 'center',
    opacity: 0.95,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radii.md,
    marginTop: Spacing.sm,
  },
  heroButtonText: {
    ...Typography.button,
    fontSize: Math.min(Typography.button.fontSize, SCREEN_WIDTH * 0.042),
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.title3,
    fontSize: Math.min(Typography.title3.fontSize, SCREEN_WIDTH * 0.05),
  },
  seeAllText: {
    ...Typography.bodyStrong,
    fontSize: Math.min(Typography.bodyStrong.fontSize, SCREEN_WIDTH * 0.038),
  },
  actionGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xs'],
  },
  actionTitle: {
    ...Typography.bodyStrong,
    fontSize: Math.min(Typography.bodyStrong.fontSize, SCREEN_WIDTH * 0.04),
  },
  actionSubtitle: {
    ...Typography.caption,
    fontSize: Math.min(Typography.caption.fontSize, SCREEN_WIDTH * 0.032),
    lineHeight: 16,
  },
  emptyState: {
    padding: Spacing['3xl'],
    borderRadius: Radii.md,
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyStateText: {
    ...Typography.body,
    fontSize: Math.min(Typography.body.fontSize, SCREEN_WIDTH * 0.038),
    textAlign: 'center',
  },
});
