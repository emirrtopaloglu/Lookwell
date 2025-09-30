import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TimelineStep {
  day: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const timelineSteps: TimelineStep[] = [
  { day: 'Day 1', label: 'Full Premium Access', icon: 'star' },
  { day: 'Day 2', label: "We'll send a reminder", icon: 'notifications' },
  { day: 'Day 3', label: 'Trial ends, subscription starts', icon: 'card' },
];

interface TimelineStepItemProps {
  step: TimelineStep;
  isLast: boolean;
}

function TimelineStepItem({ step, isLast }: TimelineStepItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepContent}>
        <View style={[styles.iconCircle, { backgroundColor: colors.accentSoft }]}>
          <Ionicons name={step.icon} size={20} color={colors.accent} />
        </View>
        <View style={styles.stepTextContainer}>
          <Text style={[styles.stepDay, { color: colors.accent }]}>
            {step.day}
          </Text>
          <Text style={[styles.stepLabel, { color: colors.text }]}>
            {step.label}
          </Text>
        </View>
      </View>
      {!isLast && (
        <View style={[styles.connector, { backgroundColor: colors.border }]} />
      )}
    </View>
  );
}

export default function FreeTrialTimeline() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundElevated, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Your 3-Day Free Trial
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.successSoft }]}>
          <Text style={[styles.badgeText, { color: colors.success }]}>
            100% Free
          </Text>
        </View>
      </View>

      <View style={styles.timeline}>
        {timelineSteps.map((step, index) => (
          <TimelineStepItem
            key={index}
            step={step}
            isLast={index === timelineSteps.length - 1}
          />
        ))}
      </View>

      <View style={[styles.reminderBox, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name="information-circle" size={16} color={colors.accent} />
        <Text style={[styles.reminderText, { color: colors.accent }]}>
          We'll remind you 1 day before your trial ends
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.title3,
    fontSize: Math.min(Typography.title3.fontSize, SCREEN_WIDTH * 0.045),
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing['2xs'],
    borderRadius: Radii.pill,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: Math.min(Typography.caption.fontSize, SCREEN_WIDTH * 0.028),
    fontWeight: '700',
  },
  timeline: {
    marginBottom: Spacing.md,
  },
  stepContainer: {
    position: 'relative',
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepDay: {
    ...Typography.caption,
    fontSize: Math.min(Typography.caption.fontSize, SCREEN_WIDTH * 0.03),
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  stepLabel: {
    ...Typography.body,
    fontSize: Math.min(Typography.body.fontSize, SCREEN_WIDTH * 0.038),
  },
  connector: {
    position: 'absolute',
    left: 19,
    top: 48,
    width: 2,
    height: 24,
  },
  reminderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.md,
  },
  reminderText: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.032),
    flex: 1,
  },
});
