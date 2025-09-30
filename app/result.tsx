import { ActionButton } from '@/components/result/ActionButton';
import { BeforeAfterSlider } from '@/components/result/BeforeAfterSlider';
import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCollectionStore } from '@/stores/useCollectionStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResultScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    generatedImageUri?: string;
    originalImageUri?: string;
    prompt?: string;
  }>();

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const accent = useThemeColor({}, 'accent');
  const textOnAccent = useThemeColor({}, 'textOnAccent');

  const addLook = useCollectionStore((state) => state.addLook);

  // Error handling
  if (!params.generatedImageUri || !params.originalImageUri) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: text }]}>
            Something went wrong. Missing image data.
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: accent }]}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={[styles.buttonText, { color: textOnAccent }]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    const newLook = {
      id: Date.now().toString(),
      imageUri: params.generatedImageUri!,
      prompt: params.prompt,
      createdAt: new Date().toISOString(),
    };

    addLook(newLook);
    Alert.alert('Saved!', 'Look added to your Style Panel!');
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(params.generatedImageUri!);
    } catch (error) {
      Alert.alert('Error', 'Failed to share image');
      console.error('Share error:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Look',
      'Are you sure you want to discard this look?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => router.push('/(tabs)'),
        },
      ]
    );
  };

  const handleCreateNew = () => {
    router.push('/(tabs)');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_bottom',
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top', 'bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: text }]}>Your New Look</Text>
            <Text style={[styles.subtitle, { color: text }]}>
              Slide to compare before & after
            </Text>
          </View>

          {/* Before/After Slider */}
          <View style={styles.sliderContainer}>
            <BeforeAfterSlider
              beforeImageUri={params.originalImageUri}
              afterImageUri={params.generatedImageUri}
            />
          </View>

          {/* Action Toolbar */}
          <View style={styles.actionToolbar}>
            <ActionButton
              iconName="save"
              label="Save"
              onPress={handleSave}
            />
            <ActionButton
              iconName="share-social"
              label="Share"
              onPress={handleShare}
            />
            <ActionButton
              iconName="trash"
              label="Delete"
              onPress={handleDelete}
              variant="danger"
            />
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: accent }, Elevations.level1]}
            onPress={handleCreateNew}
            activeOpacity={0.8}
          >
            <Text style={[styles.primaryButtonText, { color: textOnAccent }]}>
              Create a New Look
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title2,
    marginBottom: Spacing['2xs'],
  },
  subtitle: {
    ...Typography.bodySmall,
    opacity: 0.7,
  },
  sliderContainer: {
    marginBottom: Spacing.xl,
  },
  actionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.button,
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.xl,
  },
  errorText: {
    ...Typography.title3,
    textAlign: 'center',
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radii.md,
  },
  buttonText: {
    ...Typography.button,
  },
});

export default ResultScreen;

