import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { uploadTempImageAndGetSignedUrl } from '@/lib/supabase';
import { addRecentPhoto } from '@/utils/recent-photos';
import { fal } from '@fal-ai/client';

type Params = {
  source?: string | string[];
  result?: string | string[];
  req?: string | string[];
};

export default function CreateResultScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const border = useThemeColor({}, 'border');
  const background = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'accent');
  const router = useRouter();

  const { source, result, req } = useLocalSearchParams<Params>();
  const initialModelUrl = useMemo(() => decodeMaybeArray(result) ?? decodeMaybeArray(source), [result, source]);
  const requestId = useMemo(() => (Array.isArray(req) ? req[0] : req ?? ''), [req]);

  const [modelUrl, setModelUrl] = useState<string | undefined>(initialModelUrl);
  const [garmentUrl, setGarmentUrl] = useState<string | undefined>(undefined);
  const [isPicking, setIsPicking] = useState(false);
  const [isUploadingGarment, setIsUploadingGarment] = useState(false);
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [libraryPermission, requestLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [garmentPickerVisible, setGarmentPickerVisible] = useState(false);
  const [pendingGarmentLocalUri, setPendingGarmentLocalUri] = useState<string | undefined>(undefined);
  const [statusText, setStatusText] = useState<string | undefined>(undefined);
  const [lastError, setLastError] = useState<string | undefined>(undefined);
  const [isModalProcessing, setIsModalProcessing] = useState(false);
  const [modalStatus, setModalStatus] = useState<string | undefined>(undefined);
  const [modalError, setModalError] = useState<string | undefined>(undefined);
  const [lastRequestId, setLastRequestId] = useState<string | undefined>(undefined);
  const [isFinalized, setIsFinalized] = useState(false);
  const stepNumber = isFinalized ? 3 : 2;
  const progressWidth = `${(stepNumber / 3) * 100}%` as `${number}%`;

  const ensureLibraryPermission = useCallback(async () => {
    try {
      if (libraryPermission?.granted) return true;
      const resp = await requestLibraryPermission();
      if (resp?.granted) return true;
      Alert.alert('Photo library permission required', 'Allow access in Settings to add a garment image.');
      return false;
    } catch (e) {
      console.error('Permission request failed:', e);
      Alert.alert('Permission error', 'Could not verify permissions. Try again.');
      return false;
    }
  }, [libraryPermission, requestLibraryPermission]);

  const handlePickGarment = useCallback(async () => {
    try {
      setIsPicking(true);
      const ok = await ensureLibraryPermission();
      if (!ok) return;
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.92,
        allowsMultipleSelection: false,
        exif: false,
      });
      if (!res.canceled) {
        const localUri = res.assets?.[0]?.uri;
        if (!localUri) return;
        setPendingGarmentLocalUri(localUri);
        setGarmentPickerVisible(true);
      }
    } catch (e) {
      console.error('Garment pick failed:', e);
      Alert.alert('Error', 'We could not add your garment image. Please try again.');
    } finally {
      setIsPicking(false);
    }
  }, [ensureLibraryPermission]);

  const confirmUploadGarment = useCallback(async () => {
    try {
      if (!pendingGarmentLocalUri) return;
      setIsUploadingGarment(true);
      setModalError(undefined);
      setModalStatus('Uploading garment…');
      const upload = await uploadTempImageAndGetSignedUrl({
        bucket: 'temp-images',
        localUri: pendingGarmentLocalUri,
        pathPrefix: 'garments',
        expiresInSeconds: 60 * 15,
      });
      // Run try-on inside modal with newly uploaded garment URL
      setIsModalProcessing(true);
      setModalStatus('Applying garment…');
      const garmentSignedUrl = upload.signedUrl;
      await runTryOnInModal(garmentSignedUrl);
    } catch (e) {
      console.error('Garment upload failed:', e);
      setModalError('Failed to upload garment image.');
    } finally {
      setIsUploadingGarment(false);
    }
  }, [pendingGarmentLocalUri]);

  const handleTryOn = useCallback(async () => {
    try {
      if (!modelUrl) {
        Alert.alert('Model image missing', 'There is no base photo to apply the garment to.');
        return;
      }
      if (!garmentUrl) {
        Alert.alert('Garment required', 'Please add a garment image first.');
        return;
      }
      setIsTryingOn(true);
      setStatusText('Queueing request…');
      setLastError(undefined);

      const prompt =
        "You are an expert virtual try-on AI. You will be given a 'model image' and a 'garment image'. Your task is to create a new photorealistic image where the person from the 'model image' is wearing the clothing from the 'garment image'.\n\n**Crucial Rules:**\n1. Complete Garment Replacement: You MUST completely REMOVE and REPLACE the clothing item worn by the person...\n2. Preserve the Model: The person's face, hair, body shape, and pose... MUST remain unchanged.\n3. Preserve the Background: The entire background from the 'model image' MUST be preserved perfectly.\n4. Apply the Garment: Realistically fit the new garment onto the person...\n5. Output: Return ONLY the final, edited image.";

      const sub = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
          prompt,
          image_urls: [modelUrl, garmentUrl],
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            const messages = update.logs.map((l) => l.message);
            if (messages.length > 0) {
              setStatusText(messages[messages.length - 1]);
            }
          } else if (update.status === 'IN_QUEUE') {
            setStatusText('Queued…');
          } else if (update.status === 'COMPLETED') {
            setStatusText(undefined);
          }
        },
      });

      const nextUrl = pickImageUrlFromFalResult(sub?.data) ?? pickFallbackImageUrl(sub?.data);
      if (!nextUrl) {
        console.log('FAL VTO result data:', sub?.data);
        setLastError('No image returned from AI. Please try again.');
        return;
      }
      setModelUrl(nextUrl);
      setGarmentUrl(undefined);
      setStatusText(undefined);
    } catch (e: unknown) {
      console.error('Try-on failed:', e);
      const msg = (e as Error)?.message ?? 'Failed to generate try-on image.';
      setLastError(msg);
    } finally {
      setIsTryingOn(false);
    }
  }, [modelUrl, garmentUrl]);

  const runTryOnInModal = useCallback(async (garmentSignedUrl: string) => {
    try {
      if (!modelUrl) {
        setModalError('Model image missing.');
        return;
      }
      setModalStatus('Queueing request…');
      const prompt =
        "You are an expert virtual try-on AI. You will be given a 'model image' and a 'garment image'. Your task is to create a new photorealistic image where the person from the 'model image' is wearing the clothing from the 'garment image'.\n\n**Crucial Rules:**\n1. Complete Garment Replacement: You MUST completely REMOVE and REPLACE the clothing item worn by the person...\n2. Preserve the Model: The person's face, hair, body shape, and pose... MUST remain unchanged.\n3. Preserve the Background: The entire background from the 'model image' MUST be preserved perfectly.\n4. Apply the Garment: Realistically fit the new garment onto the person...\n5. Output: Return ONLY the final, edited image.";

      const sub = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
          prompt,
          image_urls: [modelUrl, garmentSignedUrl],
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            const messages = update.logs.map((l) => l.message);
            if (messages.length > 0) {
              setModalStatus(messages[messages.length - 1]);
            }
          } else if (update.status === 'IN_QUEUE') {
            setModalStatus('Queued…');
          } else if (update.status === 'COMPLETED') {
            setModalStatus(undefined);
          }
        },
      });

      const nextUrl = pickImageUrlFromFalResult(sub?.data) ?? pickFallbackImageUrl(sub?.data);
      if (!nextUrl) {
        setModalError('No image returned from AI. Please try again.');
        return;
      }
      setModelUrl(nextUrl);
      setLastRequestId(sub?.requestId);
      setGarmentUrl(undefined);
      setPendingGarmentLocalUri(undefined);
      setGarmentPickerVisible(false);
      setIsModalProcessing(false);
      setModalStatus(undefined);
      setIsFinalized(true);
    } catch (e: unknown) {
      const msg = (e as Error)?.message ?? 'Failed to generate try-on image.';
      setModalError(msg);
      setIsModalProcessing(false);
    }
  }, [modelUrl]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <View style={styles.stepHeader}>
          <Text style={[styles.stepLabel, { color: textSecondary }]}>Step {stepNumber} of 3</Text>
          <Text style={[styles.title, { color: text }]}>{isFinalized ? 'Outfit applied' : 'Your photo'}</Text>
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
        {requestId ? (
          <Text style={[styles.subtle, { color: textSecondary }]}>Request ID: {requestId}</Text>
        ) : null}

        <View style={[styles.heroCard, { borderColor: border, backgroundColor: colors.backgroundElevated }]}>
          {modelUrl ? (
            <Image source={{ uri: modelUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons name="person-outline" size={64} color={textSecondary} />
              <Text style={[styles.subtle, { color: textSecondary }]}>No image</Text>
            </View>
          )}
        </View>

          <View style={[styles.panel, { borderColor: border, backgroundColor: colors.backgroundSunken }]}>
          <Text style={[styles.panelTitle, { color: text }]}>Add a garment</Text>
          <Text style={[styles.subtle, { color: textSecondary }]}>Upload a clothing photo to try on this image.</Text>

          <View style={styles.garmentRow}>
            <Pressable
              onPress={handlePickGarment}
              disabled={isPicking || isUploadingGarment || isTryingOn}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: border, opacity: pressed ? 0.9 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Pick garment image from library"
            >
              <Ionicons name="image" size={20} color={accent} style={styles.btnIcon} />
              <Text style={[styles.secondaryButtonText, { color: text }]}>
                {isPicking || isUploadingGarment ? 'Adding…' : garmentUrl ? 'Change garment' : 'Add garment'}
              </Text>
            </Pressable>

            {/* Try-on now happens inside the modal immediately after upload */}
          </View>

          {/* Inline garment preview and status removed; all processing now handled in modal */}
        </View>

        <Pressable
          onPress={async () => {
            try {
              if (!modelUrl) return;
              await addRecentPhoto({ url: modelUrl, requestId: lastRequestId });
              Alert.alert('Saved', 'Added to your recent photos.');
            } catch (e) {
              Alert.alert('Error', 'Could not save to recent photos.');
            }
          }}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: accent, opacity: pressed ? 0.9 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Save to recent photos"
        >
          <Text style={[styles.primaryButtonText, { color: colors.textOnAccent }]}>Save</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(tabs)')}
          style={({ pressed }) => [
            styles.outlineButton,
            { borderColor: border, opacity: pressed ? 0.9 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Done"
        >
          <Text style={[styles.secondaryButtonText, { color: text }]}>{isFinalized ? 'Done' : 'Skip'}</Text>
        </Pressable>

        <Modal
          visible={garmentPickerVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setGarmentPickerVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: colors.backgroundElevated, borderColor: border }]}> 
              {!isModalProcessing ? (
                <>
                  <Text style={[styles.modalTitle, { color: text }]}>Confirm garment</Text>
                  <Text style={[styles.subtle, { color: textSecondary }]}>Preview the selected garment and confirm upload & try-on.</Text>
                  <View style={[styles.modalPreview, { borderColor: border }]}> 
                    {pendingGarmentLocalUri ? (
                      <Image source={{ uri: pendingGarmentLocalUri }} style={styles.modalImage} resizeMode="contain" />
                    ) : (
                      <View style={styles.modalPlaceholder}>
                        <Ionicons name="image-outline" size={40} color={textSecondary} />
                      </View>
                    )}
                  </View>
                  {modalError ? (
                    <Text style={[styles.errorText, { color: '#ff4d4f' }]}>{modalError}</Text>
                  ) : null}
                  <View style={styles.modalActions}>
                    <Pressable
                      onPress={() => setGarmentPickerVisible(false)}
                      style={({ pressed }) => [styles.secondaryButton, { borderColor: border, opacity: pressed ? 0.9 : 1 }]}
                    >
                      <Text style={[styles.secondaryButtonText, { color: text }]}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={confirmUploadGarment}
                      disabled={isUploadingGarment || !pendingGarmentLocalUri}
                      style={({ pressed }) => [
                        styles.primaryButton,
                        { backgroundColor: pendingGarmentLocalUri && !isUploadingGarment ? accent : colors.iconMuted, opacity: pressed ? 0.95 : 1 },
                      ]}
                    >
                      <View style={styles.btnContentRow}>
                        {isUploadingGarment ? (
                          <ActivityIndicator size="small" color={colors.textOnAccent} style={styles.buttonSpinner} />
                        ) : null}
                        <Text style={[styles.primaryButtonText, { color: pendingGarmentLocalUri && !isUploadingGarment ? colors.textOnAccent : colors.textMuted }]}>Upload & Try-on</Text>
                      </View>
                    </Pressable>
                  </View>
                </>
              ) : (
                <View style={styles.modalProcessing}>
                  <ActivityIndicator size="large" color={accent} />
                  <Text style={[styles.statusText, { color: textSecondary, marginTop: Spacing.sm }]}>
                    {modalStatus ?? 'Processing…'}
                  </Text>
                  {modalError ? (
                    <Text style={[styles.errorText, { color: '#ff4d4f', marginTop: Spacing['2xs'] }]}>{modalError}</Text>
                  ) : null}
                </View>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

function decodeMaybeArray(value?: string | string[]): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function pickImageUrlFromFalResult(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const d = data as Record<string, unknown>;
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

function pickFallbackImageUrl(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const d = data as Record<string, unknown>;
  // Some models return outputs under 'output' or 'result' with nested arrays
  const output = d['output'] as Record<string, unknown> | Array<Record<string, unknown>> | undefined;
  if (Array.isArray(output) && output.length > 0) {
    const first = output[0];
    if (first && typeof first['url'] === 'string') return first['url'] as string;
    const img = first?.['image'] as Record<string, unknown> | undefined;
    if (img && typeof img['url'] === 'string') return img['url'] as string;
  } else if (output && typeof output === 'object') {
    const maybeUrl = (output as Record<string, unknown>)['url'];
    if (typeof maybeUrl === 'string') return maybeUrl;
  }
  const result = d['result'] as Record<string, unknown> | undefined;
  if (result && typeof result['url'] === 'string') return result['url'] as string;
  return undefined;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
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
    marginTop: Spacing.lg,
    marginBottom: Spacing['2xs'],
  },
  subtle: {
    ...Typography.caption,
    marginBottom: Spacing.md,
  },
  heroCard: {
    borderRadius: Radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  heroImage: {
    width: '100%',
    height: 520,
  },
  heroPlaceholder: {
    height: 520,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  panelTitle: {
    ...Typography.title3,
    marginBottom: Spacing['2xs'],
  },
  progressTrack: {
    height: 10,
    borderRadius: Radii.pill,
    overflow: 'hidden',
    marginTop: Spacing['2xs'],
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.pill,
  },
  garmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
    flex: 1,
  },
  outlineButton: {
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: Spacing['3xl'],
  },
  primaryButton: {
    borderRadius: Radii.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  primaryButtonText: {
    ...Typography.button,
  },
  secondaryButtonText: {
    ...Typography.button,
  },
  btnIcon: {
    marginRight: Spacing['2xs'],
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2xs'],
  },
  buttonSpinner: {
    marginRight: Spacing['2xs'],
  },
  garmentPreview: {
    borderRadius: Radii.md,
    borderWidth: 1,
    marginTop: Spacing.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  garmentImage: {
    width: '100%',
    height: 160,
  },
  errorText: {
    ...Typography.bodySmall,
    marginTop: Spacing.sm,
  },
  statusText: {
    ...Typography.caption,
    marginTop: Spacing['2xs'],
  },
  fullscreenOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalCard: {
    width: '100%',
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  modalTitle: {
    ...Typography.title3,
    marginBottom: Spacing['2xs'],
  },
  modalPreview: {
    borderRadius: Radii.md,
    borderWidth: 1,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginVertical: Spacing.md,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  modalProcessing: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
});


