import DismissHeader from '@/components/create/DismissHeader';
import ActionButton from '@/components/result/ActionButton';
import { Colors, Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCollectionStore } from '@/stores/useCollectionStore';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const cardBackground = useThemeColor(
    { light: Colors.light.card, dark: Colors.dark.card },
    'card'
  );
  const textSecondary = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    'textSecondary'
  );

  // Get the look from the store
  const looks = useCollectionStore((state) => state.looks);
  const removeLook = useCollectionStore((state) => state.removeLook);
  const look = looks.find((item) => item.id === id);

  // If the look is not found, show an error
  if (!look) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: background }]}
        edges={['top', 'bottom']}
      >
        <Stack.Screen
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <DismissHeader title="Look Not Found" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={textSecondary} />
          <Text style={[styles.errorText, { color: text }]}>
            This look could not be found.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: cardBackground }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: text }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Format the creation date
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle share
  const handleShare = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(look.imageUri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share the image');
    }
  };

  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      'Delete Look',
      'Are you sure you want to delete this look from your collection?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeLook(id!);
            router.back();
          },
        },
      ]
    );
  };

  // Handle create similar
  const handleCreateSimilar = () => {
    router.back();
    // Navigate to create screen with the prompt pre-filled
    router.push({
      pathname: '/create',
      params: { prompt: look.prompt || '' },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: background }]}
      edges={['top', 'bottom']}
    >
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      <DismissHeader title="Look Details" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: look.imageUri }} style={styles.image} resizeMode="cover" />
        </View>

        {/* Look Info Section */}
        <View style={[styles.infoSection, { backgroundColor: cardBackground }]}>
          {/* Prompt */}
          {look.prompt && (
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Ionicons name="brush-outline" size={20} color={textSecondary} />
                <Text style={[styles.infoLabel, { color: textSecondary }]}>
                  Prompt Used:
                </Text>
              </View>
              <Text style={[styles.infoValue, { color: text }]}>{look.prompt}</Text>
            </View>
          )}

          {/* Creation Date */}
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <Ionicons name="calendar-outline" size={20} color={textSecondary} />
              <Text style={[styles.infoLabel, { color: textSecondary }]}>Created:</Text>
            </View>
            <Text style={[styles.infoValue, { color: text }]}>
              {formatDate(look.createdAt)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Toolbar */}
      <View style={[styles.actionToolbar, { backgroundColor: cardBackground }]}>
        <ActionButton iconName="share-social" label="Share" onPress={handleShare} />
        <ActionButton iconName="trash" label="Delete" onPress={handleDelete} />
        <ActionButton iconName="sparkles" label="Create Similar" onPress={handleCreateSimilar} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    ...Elevations.small,
  },
  infoItem: {
    marginBottom: Spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: Spacing.xs,
  },
  infoValue: {
    ...Typography.body,
    lineHeight: 24,
  },
  actionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    ...Elevations.small,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorText: {
    ...Typography.h3,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  backButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    ...Elevations.small,
  },
  backButtonText: {
    ...Typography.button,
  },
});
