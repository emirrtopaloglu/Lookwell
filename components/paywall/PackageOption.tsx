import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors, Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Package {
  id: string;
  title: string;
  pricePerMonth: string;
  totalPrice: string;
  billingPeriod: string;
  savingsLabel?: string;
  isBestValue?: boolean;
}

interface PackageOptionProps {
  package: Package;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PackageOption({ package: pkg, isSelected, onSelect }: PackageOptionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? colors.accentSoft : colors.backgroundElevated,
          borderColor: isSelected ? colors.accent : colors.border,
        },
        Platform.OS === 'ios' && isSelected && Elevations.level1,
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {pkg.isBestValue && (
        <View style={[styles.bestValueBadge, { backgroundColor: colors.accent }]}>
          <Ionicons name="star" size={12} color={colors.textOnAccent} />
          <Text style={[styles.bestValueText, { color: colors.textOnAccent }]}>
            Best Value
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              {pkg.title}
            </Text>
            {pkg.savingsLabel && (
              <View style={[styles.savingsBadge, { backgroundColor: colors.successSoft }]}>
                <Text style={[styles.savingsText, { color: colors.success }]}>
                  {pkg.savingsLabel}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.billingPeriod, { color: colors.textSecondary }]}> 
            {pkg.billingPeriod}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={[styles.pricePerMonth, { color: colors.text }]}>
            {pkg.pricePerMonth}
          </Text>
          <Text style={[styles.perMonthLabel, { color: colors.textMuted }]}>
            /month
          </Text>
        </View>

        <View
          style={[
            styles.radioButton,
            {
              borderColor: isSelected ? colors.accent : colors.border,
              backgroundColor: isSelected ? colors.accent : 'transparent',
            },
          ]}
        >
          {isSelected && (
            <View style={[styles.radioInner, { backgroundColor: colors.textOnAccent }]} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.lg,
    borderWidth: 2,
    position: 'relative',
    overflow: 'visible',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    left: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    zIndex: 1,
  },
  bestValueText: {
    ...Typography.caption,
    fontSize: Math.min(Typography.caption.fontSize, SCREEN_WIDTH * 0.028),
    fontWeight: '700',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  leftSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  title: {
    ...Typography.title3,
    fontSize: Math.min(Typography.title3.fontSize, SCREEN_WIDTH * 0.045),
  },
  savingsBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radii.xs,
  },
  savingsText: {
    ...Typography.caption,
    fontSize: Math.min(Typography.caption.fontSize, SCREEN_WIDTH * 0.026),
    fontWeight: '700',
  },
  billingPeriod: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.032),
  },
  rightSection: {
    alignItems: 'flex-end',
    marginRight: Spacing.md,
  },
  pricePerMonth: {
    ...Typography.title2,
    fontSize: Math.min(Typography.title2.fontSize, SCREEN_WIDTH * 0.055),
  },
  perMonthLabel: {
    ...Typography.caption,
    fontSize: Math.min(Typography.caption.fontSize, SCREEN_WIDTH * 0.028),
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
