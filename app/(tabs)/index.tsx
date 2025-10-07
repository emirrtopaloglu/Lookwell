import { StyleSpotlightCard } from '@/components/home/DailyLookCard';
import { HeaderComponent } from '@/components/home/HeaderComponent';
import { Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');
  const textOnAccent = useThemeColor({}, 'textOnAccent');
  const border = useThemeColor({}, 'border');
  const router = useRouter();

  const handleStartCreation = () => {
    router.push('/create');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
      <HeaderComponent subtitle="Style inspiration, daily." />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>Ready for today’s look?</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>Upload your photo and let Lookwell style you in seconds.</Text>
        </View>

        <StyleSpotlightCard />

        <View style={[styles.quickStartCard, { borderColor: border }]}> 
          <Text style={[styles.quickStartTitle, { color: text }]}>Start your style session</Text>
          <Text style={[styles.quickStartSubtitle, { color: textSecondary }]}>Enjoy two free trials. Pick your portrait and see the transformation.</Text>
          <Pressable
            onPress={handleStartCreation}
            style={({ pressed }) => [
              styles.quickStartButton,
              { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.quickStartButtonText, { color: textOnAccent }]}>Create your next look</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...Typography.title2,
    marginBottom: Spacing['2xs'],
  },
  subtitle: {
    ...Typography.body,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  quickStartCard: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  quickStartTitle: {
    ...Typography.title3,
    marginBottom: Spacing['2xs'],
  },
  quickStartSubtitle: {
    ...Typography.bodySmall,
    marginBottom: Spacing.md,
  },
  quickStartButton: {
    borderRadius: Radii.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStartButtonText: {
    ...Typography.button,
  },
});