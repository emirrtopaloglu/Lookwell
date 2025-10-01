import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { deviceKeys, useUpdateDevice, useUpdateProfile } from '@/hooks/useDeviceRegistration';
import type { AgeRange, Gender, ProfileSetupData, StylePreference } from '@/types/profile';
import { useQueryClient } from '@tanstack/react-query';

const GENDER_OPTIONS: { value: Gender; label: string; icon: string }[] = [
  { value: 'male', label: 'Male', icon: '👨' },
  { value: 'female', label: 'Female', icon: '👩' },
  { value: 'non-binary', label: 'Non-binary', icon: '🧑' },
  { value: 'prefer not to say', label: 'Prefer not to say', icon: '✨' },
];

const AGE_RANGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45-54', label: '45-54' },
  { value: '55+', label: '55+' },
];

const STYLE_PREFERENCES: { value: StylePreference; label: string; emoji: string }[] = [
  { value: 'streetwear', label: 'Streetwear', emoji: '🧢' },
  { value: 'casual', label: 'Casual', emoji: '👕' },
  { value: 'business', label: 'Business', emoji: '👔' },
  { value: 'sporty', label: 'Sporty', emoji: '⚽' },
  { value: 'elegant', label: 'Elegant', emoji: '👗' },
  { value: 'bohemian', label: 'Bohemian', emoji: '🌸' },
  { value: 'minimalist', label: 'Minimalist', emoji: '⚪' },
  { value: 'vintage', label: 'Vintage', emoji: '🕰️' },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const textMuted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');

  const { mutateAsync: updateDevice } = useUpdateDevice();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProfileSetupData>({
    displayName: '',
    gender: null,
    ageRange: null,
    stylePreferences: [],
  });

  const handleStyleToggle = (style: StylePreference) => {
    setFormData((prev) => ({
      ...prev,
      stylePreferences: prev.stylePreferences.includes(style)
        ? prev.stylePreferences.filter((s) => s !== style)
        : [...prev.stylePreferences, style],
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.displayName.trim()) {
      Alert.alert('Required Field', 'Please enter your name');
      return;
    }

    if (!formData.gender) {
      Alert.alert('Required Field', 'Please select your gender');
      return;
    }
    if (!formData.ageRange) {
      Alert.alert('Required Field', 'Please select your age range');
      return;
    }
    if (formData.stylePreferences.length === 0) {
      Alert.alert('Required Field', 'Please select at least one style');
      return;
    }

    try {
      // Build profile object according to API schema enums
      const profile = {
        name: formData.displayName.trim(),
        gender: formData.gender!,
        ageRange: formData.ageRange!,
        stylePreferences: formData.stylePreferences,
      };

      // Persist profile via PATCH /v1/device/profile
      await updateProfile(profile);
      // Ensure latest device is in cache before navigating
      await queryClient.invalidateQueries({ queryKey: deviceKeys.current() });

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Profile setup error:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const isValid = formData.displayName.trim() !== '' && formData.gender !== null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: text }]}>Complete Your Profile</Text>
            <Text style={[styles.subtitle, { color: textMuted }]}>
              Help us personalize your style experience
            </Text>
          </View>

          {/* Display Name */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              What should we call you? <Text style={{ color: danger }}>*</Text>
            </Text>
            <TextField
              placeholder="Enter your name"
              value={formData.displayName}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, displayName: value }))}
              autoCapitalize="words"
              maxLength={50}
              helperText="This will appear in your experience"
              selectionColor={primary}
            />
          </View>

          {/* Gender Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Gender <Text style={{ color: danger }}>*</Text>
            </Text>
            <View style={styles.genderGrid}>
              {GENDER_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={`${option.icon} ${option.label}`}
                  selected={formData.gender === option.value}
                  onPress={() => setFormData((prev) => ({ ...prev, gender: option.value }))}
                  style={{ flex: 1, minWidth: '47%', justifyContent: 'center' }}
                />
              ))}
            </View>
          </View>

          {/* Age Range (Optional) */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Age Range <Text style={[styles.optional, { color: textMuted }]}>(optional)</Text>
            </Text>
            <View style={styles.ageRangeContainer}>
              {AGE_RANGE_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={formData.ageRange === option.value}
                  onPress={() => setFormData((prev) => ({ ...prev, ageRange: option.value }))}
                  size="sm"
                />
              ))}
            </View>
          </View>

          {/* Style Preferences (Optional) */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Style Preferences <Text style={[styles.optional, { color: textMuted }]}>(optional)</Text>
            </Text>
            <Text style={[styles.sectionDescription, { color: textMuted }]}>
              Select styles you love. You can choose multiple.
            </Text>
            <View style={styles.styleGrid}>
              {STYLE_PREFERENCES.map((style) => (
                <Chip
                  key={style.value}
                  label={`${style.emoji} ${style.label}`}
                  selected={formData.stylePreferences.includes(style.value)}
                  onPress={() => handleStyleToggle(style.value)}
                />
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <PrimaryButton
            title={isPending ? 'Saving...' : 'Continue'}
            onPress={handleSubmit}
            loading={isPending}
            disabled={!isValid || isPending}
            style={{ marginTop: Spacing['2xl'] }}
          />

          <Text style={[styles.footnote, { color: textMuted }]}>
            Your profile helps us provide better style recommendations
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  header: {
    marginBottom: Spacing['2xl'],
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  title: {
    ...Typography.title1,
    letterSpacing: -0.2,
  },
  subtitle: {
    ...Typography.bodySmall,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.title3,
    marginBottom: Spacing.sm,
  },
  optional: {
    ...Typography.caption,
    fontWeight: '400',
  },
  sectionDescription: {
    ...Typography.caption,
    marginBottom: Spacing.sm,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 52,
  },
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  genderButton: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 2,
    borderRadius: 12,
    padding: Spacing.md,
    height: 60,
  },
  genderIcon: {
    fontSize: 24,
  },
  genderLabel: {
    ...Typography.body,
    fontWeight: '600',
  },
  ageRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  ageRangeButton: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  ageRangeLabel: {
    ...Typography.body,
    fontWeight: '600',
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  styleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  styleEmoji: {
    fontSize: 18,
  },
  styleLabel: {
    ...Typography.caption,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    height: 56,
    justifyContent: 'center',
    ...({
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    } as const),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...Typography.button,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  footnote: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});

