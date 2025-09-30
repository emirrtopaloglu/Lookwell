import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCollectionStore } from '@/stores/useCollectionStore';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CollectionDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    imageUri: string;
    prompt: string;
    createdAt: string;
  }>();
  
  const background = useThemeColor({}, 'background');
  const backgroundElevated = useThemeColor({}, 'backgroundElevated');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const textMuted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const danger = useThemeColor({}, 'danger');
  const textOnAccent = useThemeColor({}, 'textOnAccent');

  const removeLook = useCollectionStore((state) => state.removeLook);

  const handleDelete = () => {
    Alert.alert(
      'Delete Look',
      'Are you sure you want to remove this look from your collection?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeLook(params.id);
            router.back();
          },
        },
      ]
    );
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'modal',
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: backgroundElevated, borderBottomColor: border }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color={textSecondary} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: text }]}>Look Details</Text>
          
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={24} color={danger} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Image */}
          <View style={[styles.imageContainer, Elevations.level2]}>
            <Image source={{ uri: params.imageUri }} style={styles.image} />
          </View>

          {/* Details */}
          <View style={styles.detailsSection}>
            {params.prompt && (
              <View style={[styles.infoCard, { backgroundColor: backgroundElevated }]}>
                <Text style={[styles.infoLabel, { color: textMuted }]}>Prompt Used</Text>
                <Text style={[styles.infoText, { color: text }]}>{params.prompt}</Text>
              </View>
            )}

            <View style={[styles.infoCard, { backgroundColor: backgroundElevated }]}>
              <Text style={[styles.infoLabel, { color: textMuted }]}>Created On</Text>
              <Text style={[styles.infoText, { color: text }]}>{formatDate(params.createdAt)}</Text>
            </View>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            style={[styles.deleteButtonLarge, { backgroundColor: danger }]}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={20} color={textOnAccent} />
            <Text style={[styles.deleteButtonText, { color: textOnAccent }]}>
              Delete from Collection
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.title3,
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    margin: Spacing.md,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    aspectRatio: 3 / 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsSection: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  infoCard: {
    padding: Spacing.md,
    borderRadius: Radii.md,
  },
  infoLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing['2xs'],
  },
  infoText: {
    ...Typography.body,
  },
  deleteButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    gap: Spacing.xs,
  },
  deleteButtonText: {
    ...Typography.button,
  },
});

export default CollectionDetailScreen;

