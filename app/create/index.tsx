import { uploadTempImageAndGetSignedUrl } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { fal } from '@fal-ai/client';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Colors,
  Elevations,
  Radii,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

type LocalSearchParams = {
  prompt?: string | string[];
};

export default function CreateStepOneScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const accent = useThemeColor({}, 'accent');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const border = useThemeColor({}, 'border');
  const background = useThemeColor({}, 'background');
  const overlay = useThemeColor({}, 'overlay');

  const params = useLocalSearchParams<LocalSearchParams>();
  const suggestedPrompt = useMemo(() => {
    const promptParam = params.prompt;
    if (!promptParam) {
      return undefined;
    }

    return Array.isArray(promptParam) ? promptParam[0] : promptParam;
  }, [params.prompt]);

  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isRequestingImage, setIsRequestingImage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultInfo, setResultInfo] = useState<{
    sourcePath?: string;
    resultPath?: string;
    resultSignedUrl?: string;
  } | null>(null);
  const [libraryPermission, requestLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const ensureLibraryPermission = useCallback(
    async () => {
      try {
        if (libraryPermission?.granted) {
          return true;
        }

        const response = await requestLibraryPermission();
        if (response?.granted) {
          return true;
        }

        Alert.alert(
          'Photo library permission required',
          'Allow photo library access in Settings so you can pick an existing image.'
        );
        return false;
      } catch (error) {
        console.error('Permission request failed:', error);
        Alert.alert(
          'Permission error',
          'We could not verify permissions. Please try again or update them in Settings.'
        );
        return false;
      }
    },
    [libraryPermission, requestLibraryPermission]
  );

  const handleSelectImage = useCallback(
    async () => {
      try {
        setIsRequestingImage(true);

        const hasPermission = await ensureLibraryPermission();
        if (!hasPermission) {
          return;
        }

        const libraryResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.92,
          allowsMultipleSelection: false,
          exif: false,
        });

        if (!libraryResult.canceled) {
          setSelectedImageUri(libraryResult.assets?.[0]?.uri ?? null);
        }
      } catch (error) {
        console.error('Image selection failed:', error);
        Alert.alert(
          'Something went wrong',
          'We could not access your photo. Please try again in a moment.'
        );
      } finally {
        setIsRequestingImage(false);
      }
    },
    [ensureLibraryPermission]
  );

  const handleContinue = useCallback(async () => {
    try {
      if (!selectedImageUri) {
        Alert.alert(
          'Photo required',
          'Choose a portrait before continuing to the next step.'
        );
        return;
      }
      setIsProcessing(true);

      // 1) Upload local photo to Supabase (temp signed URL)
      const upload = await uploadTempImageAndGetSignedUrl({
        bucket: 'temp-images',
        localUri: selectedImageUri,
        pathPrefix: 'uploads',
        expiresInSeconds: 60 * 15,
      });

      const sourceSignedUrl = upload.signedUrl;
      setResultInfo({ sourcePath: upload.path, resultSignedUrl: sourceSignedUrl });

      // 2) Call FAL with the signed URL and subscribe to logs
      const result = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
          prompt:
            'You are an expert fashion photographer AI. Transform the person in this image into a full-body fashion model photo suitable for an e-commerce website. The background must be a clean, neutral studio backdrop (light gray, #f0f0f0). The person should have a neutral, professional model expression. Preserve the person\'s identity, unique features, and body type, but place them in a standard, relaxed standing model pose. The final image must be photorealistic. Return ONLY the final image.',
          image_urls: [sourceSignedUrl],
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      const resultUrl = pickImageUrlFromFalResult(result?.data);
      if (!resultUrl) {
        console.log('FAL result data:', result?.data);
        console.log('FAL requestId:', result?.requestId);
        Alert.alert('Processing error', 'Could not resolve the processed image URL.');
        return;
      }

      // Navigate to next step with both source and result URLs
      router.push({
        pathname: '/create/result',
        params: {
          source: encodeURIComponent(sourceSignedUrl),
          result: encodeURIComponent(resultUrl),
          req: result?.requestId ?? '',
        },
      });
    } catch (error: unknown) {
      console.error('Continue flow failed:', error);
      Alert.alert('Error', (error as Error)?.message ?? 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImageUri]);

  const progressWidth = useMemo<`${number}%`>(() => `${(1 / 3) * 100}%`, []);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: background }]}
      edges={['top']}
    >
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Create</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        bounces={false}
      >
        <View style={styles.stepHeader}>
          <Text style={[styles.stepLabel, { color: textSecondary }]}>Step 1 of 3</Text>
          <Text style={[styles.title, { color: text }]}>Prepare your photo</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>Upload a bright, front-facing portrait so we can tailor the look to you.</Text>

          <View
            style={[
              styles.progressTrack,
              { backgroundColor: colors.backgroundSunken },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                { width: progressWidth, backgroundColor: accent },
              ]}
            />
          </View>
        </View>

        {suggestedPrompt ? (
          <View
            style={[
              styles.promptBadge,
              { backgroundColor: overlay, borderColor: border },
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={accent}
              style={styles.promptIcon}
            />
            <View style={styles.promptContent}>
              <Text
                style={[styles.promptLabel, { color: textSecondary }]}
              >
                Suggested style
              </Text>
              <Text style={[styles.promptText, { color: text }]}>
                {suggestedPrompt}
              </Text>
            </View>
          </View>
        ) : null}

        <View
          style={[
            styles.previewCard,
            { backgroundColor: colors.backgroundElevated, borderColor: border },
          ]}
        >
          {selectedImageUri ? (
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons
                name="person-circle-outline"
                size={64}
                color={textSecondary}
              />
              <Text style={[styles.placeholderTitle, { color: text }]}>No photo yet</Text>
              <Text style={[styles.placeholderSubtitle, { color: textSecondary }]}>Choose a portrait from your photo library to get started.</Text>
            </View>
          )}
        </View>

        {isProcessing ? (
          <View style={[styles.loadingOverlay, { backgroundColor: overlay }]}> 
            <ActivityIndicator size="small" color={accent} style={styles.loadingSpinner} />
            <Text style={[styles.loadingText, { color: textSecondary }]}>Uploading and generating…</Text>
          </View>
        ) : null}

        <View style={styles.actionGroup}>
          <SelectionButton
            label="Choose from library"
            icon="image"
            onPress={handleSelectImage}
            disabled={isRequestingImage}
          />
        </View>

        <View
          style={[
            styles.guidelinesCard,
            { borderColor: border, backgroundColor: colors.backgroundSunken },
          ]}
        >
          <Text style={[styles.guidelinesTitle, { color: text }]}>Pro tips</Text>
          <View style={styles.guidelineRow}>
            <Ionicons
              name="sunny-outline"
              size={18}
              color={accent}
              style={styles.guidelineIcon}
            />
            <Text style={[styles.guidelineText, { color: textSecondary }]}>Shoot in even, bright lighting for the sharpest results.</Text>
          </View>
          <View style={styles.guidelineRow}>
            <Ionicons
              name="body-outline"
              size={18}
              color={accent}
              style={styles.guidelineIcon}
            />
            <Text style={[styles.guidelineText, { color: textSecondary }]}>Frame your face and shoulders straight on.</Text>
          </View>
          <View style={styles.guidelineRow}>
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={accent}
              style={styles.guidelineIcon}
            />
            <Text style={[styles.guidelineText, { color: textSecondary }]}>Keep a relaxed expression for a natural finish.</Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.continueButton,
            {
              backgroundColor: selectedImageUri && !isProcessing ? accent : colors.iconMuted,
            },
          ]}
          onPress={handleContinue}
          disabled={!selectedImageUri || isProcessing}
          accessibilityRole="button"
          accessibilityLabel="Continue to process your selected photo"
        >
          <View style={styles.buttonContent}> 
            {isProcessing ? (
              <ActivityIndicator size="small" color={colors.textOnAccent} style={styles.buttonSpinner} />
            ) : null}
            <Text
              style={[
                styles.continueButtonText,
                {
                  color: selectedImageUri && !isProcessing ? colors.textOnAccent : colors.textMuted,
                },
              ]}
            >
              {isProcessing ? 'Processing…' : 'Continue'}
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type SelectionButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
};

const SelectionButton = ({ label, icon, onPress, disabled }: SelectionButtonProps) => {
  const accent = useThemeColor({}, 'accent');
  const text = useThemeColor({}, 'text');
  const border = useThemeColor({}, 'border');
  const iconMuted = useThemeColor({}, 'iconMuted');
  const iconColor = disabled ? iconMuted : accent;
  const labelColor = disabled ? iconMuted : text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.selectionButton,
        {
          backgroundColor: 'transparent',
          borderColor: border,
          opacity: disabled ? 0.5 : 1,
        },
        pressed && !disabled ? { transform: [{ scale: 0.98 }] } : null,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Ionicons
        name={icon}
        size={24}
        color={iconColor}
        style={styles.selectionIcon}
      />
      <Text style={[styles.selectionLabel, { color: labelColor }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.md,
  },
  headerTitle: {
    ...Typography.title3,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  stepHeader: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  stepLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing['2xs'],
  },
  title: {
    ...Typography.title2,
    marginBottom: Spacing['2xs'],
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  progressTrack: {
    height: 10,
    borderRadius: Radii.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.pill,
  },
  promptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  promptIcon: {
    marginRight: Spacing.sm,
  },
  promptContent: {
    flex: 1,
  },
  promptLabel: {
    ...Typography.caption,
    marginBottom: Spacing['3xs'],
    textTransform: 'uppercase',
  },
  promptText: {
    ...Typography.body,
  },
  previewCard: {
    borderRadius: Radii.xl,
    borderWidth: 1,
    height: 340,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Elevations.level1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  placeholderTitle: {
    ...Typography.title3,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing['3xs'],
  },
  placeholderSubtitle: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
  actionGroup: {
    marginBottom: Spacing.lg,
    alignItems: 'stretch',
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
    width: '100%',
  },
  selectionIcon: {
    marginRight: Spacing['2xs'],
  },
  selectionLabel: {
    ...Typography.button,
  },
  guidelinesCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  guidelinesTitle: {
    ...Typography.title3,
    marginBottom: Spacing.sm,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['2xs'],
  },
  guidelineIcon: {
    marginRight: Spacing.sm,
  },
  guidelineText: {
    ...Typography.bodySmall,
    flex: 1,
  },
  continueButton: {
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    ...Typography.button,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    marginBottom: Spacing['2xs'],
  },
  loadingText: {
    ...Typography.bodySmall,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2xs'],
  },
  buttonSpinner: {
    marginRight: Spacing['2xs'],
  },
});

function pickImageUrlFromFalResult(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const d = data as Record<string, unknown>;
  // Common shapes from FAL image models
  const direct = typeof d['url'] === 'string' ? (d['url'] as string) : undefined;
  if (direct) return direct;
  const image = d['image'] as Record<string, unknown> | undefined;
  if (image && typeof image['url'] === 'string') return image['url'] as string;
  const images = d['images'] as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (first && typeof first['url'] === 'string') return first['url'] as string;
  }
  return undefined;
}
