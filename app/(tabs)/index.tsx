import { HeaderComponent } from '@/components/home/HeaderComponent';
import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getRecentPhotos, RecentPhoto } from '@/utils/recent-photos';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - Spacing.lg * 3) / 2;

export default function HomeScreen() {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');
  const textOnAccent = useThemeColor({}, 'textOnAccent');
  const border = useThemeColor({}, 'border');
  const backgroundElevated = useThemeColor({}, 'backgroundElevated');
  const backgroundSunken = useThemeColor({}, 'backgroundSunken');
  const accentSoft = useThemeColor({}, 'accentSoft');
  const icon = useThemeColor({}, 'icon');
  const router = useRouter();

  const [recent, setRecent] = useState<RecentPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<RecentPhoto | null>(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const handleStartCreation = () => {
    router.push('/create');
  };

  const handleRecentPhotoPress = (photo: RecentPhoto) => {
    setSelectedPhoto(photo);
    setPhotoModalVisible(true);
  };

  const handleLongPress = (photo: RecentPhoto) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePhoto(photo.id),
        },
      ]
    );
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const currentPhotos = await getRecentPhotos();
      const updatedPhotos = currentPhotos.filter(p => p.id !== photoId);
      await AsyncStorage.setItem('lookwell.recentPhotos.v1', JSON.stringify(updatedPhotos));
      setRecent(updatedPhotos);
      Alert.alert('Success', 'Photo deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete photo');
    }
  };

  const closePhotoModal = () => {
    setPhotoModalVisible(false);
    setSelectedPhoto(null);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const items = await getRecentPhotos();
      if (mounted) setRecent(items);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
      <HeaderComponent subtitle="Style inspiration, daily." />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.heroCard, { backgroundColor: backgroundElevated, borderColor: border }, Elevations.level2]}>
            <LinearGradient
              colors={[accent + '08', accent + '02']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroContent}>
                <View style={[styles.heroIcon, { backgroundColor: accent + '15' }]}>
                  <Ionicons name="sparkles" size={32} color={accent} />
                </View>
                <Text style={[styles.heroTitle, { color: text }]}>
                  Ready for today's look?
                </Text>
                <Text style={[styles.heroSubtitle, { color: textSecondary }]}>
                  Transform your style with AI-powered virtual try-ons. Upload your photo and discover outfits that perfectly match your vibe.
                </Text>
                <TouchableOpacity
                  onPress={handleStartCreation}
                  style={[styles.primaryButton, { backgroundColor: accent }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.primaryButtonText, { color: textOnAccent }]}>
                    Start Creating
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={textOnAccent} style={styles.buttonIcon} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>


        {/* Recent Photos Grid */}
        {recent.length > 0 ? (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={[styles.sectionTitle, { color: text }]}>Recent Creations</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={[styles.seeAllText, { color: accent }]}>See All</Text>
                <Ionicons name="chevron-forward" size={16} color={accent} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.photosGrid}>
              {recent.map((photo, index) => (
                <TouchableOpacity
                  key={photo.id}
                  onPress={() => handleRecentPhotoPress(photo)}
                  onLongPress={() => handleLongPress(photo)}
                  style={[
                    styles.photoCard,
                    { backgroundColor: backgroundElevated, borderColor: border },
                    Elevations.level1
                  ]}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: photo.url }}
                    style={styles.photoImage}
                    resizeMode="cover"
                  />
                  <View style={[styles.photoOverlay, { backgroundColor: background + 'E6' }]}>
                    <View style={styles.photoInfo}>
                      <Text style={[styles.photoDate, { color: textSecondary }]}>
                        {new Date(photo.createdAt).toLocaleDateString()}
                      </Text>
                      <View style={[styles.photoBadge, { backgroundColor: accent }]}>
                        <Ionicons name="checkmark" size={12} color={textOnAccent} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: backgroundSunken }]}>
              <Ionicons name="images-outline" size={48} color={textSecondary + '60'} />
            </View>
            <Text style={[styles.emptyTitle, { color: text }]}>No creations yet</Text>
            <Text style={[styles.emptySubtitle, { color: textSecondary }]}>
              Start by creating your first AI-powered style transformation
            </Text>
            <TouchableOpacity
              onPress={handleStartCreation}
              style={[styles.emptyButton, { backgroundColor: accent }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.emptyButtonText, { color: textOnAccent }]}>Create Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Photo Modal */}
        <Modal
          visible={photoModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closePhotoModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: backgroundElevated }]}>
              <Pressable
                style={styles.modalCloseButton}
                onPress={closePhotoModal}
              >
                <Ionicons name="close" size={24} color={text} />
              </Pressable>
              {selectedPhoto && (
                <Image
                  source={{ uri: selectedPhoto.url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalActionButton, { backgroundColor: backgroundElevated, borderColor: border }]}
                  onPress={closePhotoModal}
                >
                  <Ionicons name="close" size={20} color={text} />
                  <Text style={[styles.modalActionText, { color: text }]}>Close</Text>
                </TouchableOpacity>
                {selectedPhoto && (
                  <TouchableOpacity
                    style={[styles.modalActionButton, { backgroundColor: accent }]}
                    onPress={() => {
                      closePhotoModal();
                      handleLongPress(selectedPhoto);
                    }}
                  >
                    <Ionicons name="trash" size={20} color={textOnAccent} />
                    <Text style={[styles.modalActionText, { color: textOnAccent }]}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  
  // Hero Section
  heroSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  heroCard: {
    borderRadius: Radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: Spacing['2xl'],
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    ...Typography.title1,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: Radii.full,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    ...Typography.button,
    fontSize: 18,
  },
  buttonIcon: {
    marginLeft: Spacing['2xs'],
  },

  sectionTitle: {
    ...Typography.title2,
    marginBottom: Spacing.lg,
  },

  // Recent Photos
  recentSection: {
    paddingHorizontal: Spacing.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
  seeAllText: {
    ...Typography.button,
    fontSize: 14,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  photoCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    borderRadius: Radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
  },
  photoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoDate: {
    ...Typography.caption,
    fontSize: 11,
  },
  photoBadge: {
    width: 20,
    height: 20,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['3xl'],
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  emptyTitle: {
    ...Typography.title2,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: 24,
  },
  emptyButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: Radii.full,
  },
  emptyButtonText: {
    ...Typography.button,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    borderRadius: Radii.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalActions: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  modalActionText: {
    ...Typography.button,
  },
});