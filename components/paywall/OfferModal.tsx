import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors, Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OfferModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  discountPercentage?: number;
}

export default function OfferModal({
  visible,
  onAccept,
  onDecline,
  discountPercentage = 20,
}: OfferModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [secondsLeft, setSecondsLeft] = useState(120);
  const pulse = useRef(new Animated.Value(1)).current;

  // Derive MM:SS text
  const timerText = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const s = (secondsLeft % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  }, [secondsLeft]);

  // Countdown lifecycle
  useEffect(() => {
    if (!visible) return;
    setSecondsLeft(120);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto decline on expiry
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible, onDecline]);

  // Pulsing animation
  useEffect(() => {
    if (!visible) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [visible, pulse]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDecline}
    >
      <View style={[styles.overlay, { backgroundColor: colors.scrim }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.warningSoft }]}>
            <Ionicons name="time" size={48} color={colors.warning} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            Wait! Special Offer
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Before you go, we have a limited-time offer just for you
          </Text>

          {/* Offer Card + Countdown */}
          <Animated.View
            style={[
              styles.offerCard,
              { backgroundColor: colors.accentSoft, borderColor: colors.accent },
              { transform: [{ scale: pulse }] },
            ]}
          >
            <View style={styles.offerHeader}>
              <Ionicons name="gift" size={24} color={colors.accent} />
              <Text style={[styles.offerTitle, { color: colors.accent }]}>
                Exclusive Discount
              </Text>
            </View>
            <Text style={[styles.offerDiscount, { color: colors.text }]}>
              {discountPercentage}% OFF
            </Text>
            <Text style={[styles.offerSubtext, { color: colors.textSecondary }]}>
              Your first year subscription
            </Text>
            <View style={styles.timerPill}>
              <Ionicons name="time" size={16} color={colors.textOnAccent} />
              <Text style={[styles.timerText, { color: colors.textOnAccent }]}>
                {timerText}
              </Text>
            </View>
          </Animated.View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.benefitText, { color: colors.text }]}>
                Still includes 3-day free trial
              </Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.benefitText, { color: colors.text }]}>
                Cancel anytime before trial ends
              </Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.benefitText, { color: colors.text }]}>
                Hurry! This special price expires when the timer hits 00:00
              </Text>
            </View>
          </View>

          {/* Accept Button */}
          <TouchableOpacity
            style={[
              styles.acceptButton,
              { backgroundColor: colors.accent },
              Platform.OS === 'ios' && Elevations.level2,
            ]}
            onPress={onAccept}
            activeOpacity={0.85}
          >
            <Text style={[styles.acceptButtonText, { color: colors.textOnAccent }]}>
              Claim {discountPercentage}% Discount
            </Text>
          </TouchableOpacity>

          {/* Decline Button */}
          <TouchableOpacity
            style={styles.declineButton}
            onPress={onDecline}
            activeOpacity={0.7}
          >
            <Text style={[styles.declineButtonText, { color: colors.textSecondary }]}>
              No thanks, I'll pay full price
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Radii.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title1,
    fontSize: Math.min(Typography.title1.fontSize, SCREEN_WIDTH * 0.07),
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    fontSize: Math.min(Typography.body.fontSize, SCREEN_WIDTH * 0.038),
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  offerCard: {
    width: '100%',
    borderRadius: Radii.lg,
    borderWidth: 2,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  offerTitle: {
    ...Typography.bodyStrong,
    fontSize: Math.min(Typography.bodyStrong.fontSize, SCREEN_WIDTH * 0.04),
  },
  offerDiscount: {
    ...Typography.display,
    fontSize: Math.min(48, SCREEN_WIDTH * 0.12),
    marginBottom: Spacing['2xs'],
  },
  offerSubtext: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.032),
  },
  timerPill: {
    marginTop: Spacing.md,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.accent, // will be overridden by textOnAccent color usage
  },
  timerText: {
    ...Typography.bodyStrong,
    letterSpacing: 1,
  },
  benefitsContainer: {
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    ...Typography.body,
    fontSize: Math.min(Typography.body.fontSize, SCREEN_WIDTH * 0.036),
    flex: 1,
  },
  acceptButton: {
    width: '100%',
    paddingVertical: Spacing.lg,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  acceptButtonText: {
    ...Typography.button,
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
  },
  declineButton: {
    paddingVertical: Spacing.sm,
  },
  declineButtonText: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.034),
  },
});
