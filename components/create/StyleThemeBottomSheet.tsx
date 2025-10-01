import { STYLE_THEMES, type StyleTheme } from '@/constants/style-themes';
import { Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing['2xl'] * 2 - Spacing.md) / 2;
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

interface StyleThemeBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectTheme: (theme: StyleTheme) => void;
  selectedThemeId?: string;
}

export const StyleThemeBottomSheet: React.FC<StyleThemeBottomSheetProps> = ({
  visible,
  onClose,
  onSelectTheme,
  selectedThemeId,
}) => {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');
  const border = useThemeColor({}, 'border');
  const backgroundElevated = useThemeColor({}, 'backgroundElevated');
  const scrim = useThemeColor({}, 'scrim');

  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: BOTTOM_SHEET_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, backdropOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const handleSelectTheme = (theme: StyleTheme) => {
    onSelectTheme(theme);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: scrim, opacity: backdropOpacity },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheet,
            { backgroundColor: background, transform: [{ translateY }] },
          ]}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.titleRow}>
                <View style={[styles.iconBadge, { backgroundColor: accent + '15' }]}>
                  <Ionicons name="sparkles" size={24} color={accent} />
                </View>
                <View style={styles.titleContainer}>
                  <Text style={[styles.title, { color: text }]}>
                    Style Inspirations
                  </Text>
                  <Text style={[styles.subtitle, { color: textSecondary }]}>
                    Choose a curated look for your transformation
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Grid Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.grid}>
              {STYLE_THEMES.map((theme) => {
                const isSelected = selectedThemeId === theme.id;

                return (
                  <TouchableOpacity
                    key={theme.id}
                    style={[
                      styles.card,
                      {
                        backgroundColor: backgroundElevated,
                        borderColor: isSelected ? accent : border,
                      },
                      isSelected && styles.cardSelected,
                      Elevations.level2,
                    ]}
                    onPress={() => handleSelectTheme(theme)}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={{ uri: theme.imageUri }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    {isSelected && (
                      <View style={[styles.selectedOverlay, { backgroundColor: accent + '20' }]}>
                        <View style={[styles.checkmarkLarge, { backgroundColor: accent }]}>
                          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                        </View>
                      </View>
                    )}
                    <View style={styles.cardContent}>
                      <Text
                        style={[
                          styles.cardTitle,
                          { color: isSelected ? accent : text },
                        ]}
                        numberOfLines={2}
                      >
                        {theme.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    height: BOTTOM_SHEET_HEIGHT,
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    overflow: 'hidden',
  },
  dragHandleContainer: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: Radii.pill,
  },
  header: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: Radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.title2,
    marginBottom: Spacing['3xs'],
  },
  subtitle: {
    ...Typography.bodySmall,
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: Radii.lg,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 3,
  },
  cardImage: {
    width: '100%',
    height: CARD_WIDTH * 1.35,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 60,
  },
  checkmarkLarge: {
    width: 48,
    height: 48,
    borderRadius: Radii.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: Spacing.md,
    minHeight: 60,
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.bodyStrong,
    fontSize: 15,
    lineHeight: 20,
  },
});

