import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const EmptyStateComponent = () => {
  const router = useRouter();
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');
  const textOnAccent = useThemeColor({}, 'textOnAccent');

  const handleCreateFirst = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/Wardrobe.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      
      <Text style={[styles.title, { color: text }]}>Your Style Panel is Empty</Text>
      <Text style={[styles.subtitle, { color: textSecondary }]}>
        The amazing looks you create will accumulate here.
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: accent }]}
        onPress={handleCreateFirst}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: textOnAccent }]}>
          Create Your First Look
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title2,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
  },
  buttonText: {
    ...Typography.button,
  },
});

