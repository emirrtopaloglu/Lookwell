import { Radii, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { negativeFeedbackOptions, NegativeFeedbackReason } from '@/types/feedback';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface FeedbackSectionProps {
  onFeedback: (type: 'positive' | 'negative', reason?: NegativeFeedbackReason) => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const cardBackground = useThemeColor({}, 'backgroundAlt');
  const border = useThemeColor({}, 'border');

  const handlePositiveFeedback = () => {
    setFeedbackGiven(true);
    onFeedback('positive');
  };

  const handleNegativeFeedback = () => {
    setShowReasonModal(true);
  };

  const handleReasonSelect = (reason: NegativeFeedbackReason) => {
    setShowReasonModal(false);
    setFeedbackGiven(true);
    onFeedback('negative', reason);
  };

  if (feedbackGiven) {
    return (
      <View style={[styles.container, { backgroundColor: cardBackground }]}>
        <View style={styles.thankYouContainer}>
          <Ionicons name="checkmark-circle" size={32} color="#10B981" />
          <Text style={[styles.thankYouText, { color: text }]}>
            Thank you for your feedback! 💚
          </Text>
          <Text style={[styles.thankYouSubtext, { color: textSecondary }]}>
            This helps us improve your experience
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor: cardBackground }]}>
        <Text style={[styles.title, { color: text }]}>How do you like this result?</Text>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          Your feedback helps us create better styles for you
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.feedbackButton, styles.positiveButton]}
            onPress={handlePositiveFeedback}
            activeOpacity={0.8}
          >
            <Ionicons name="thumbs-up" size={28} color="#FFFFFF" />
            <Text style={styles.buttonText}>Love it</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.feedbackButton, styles.negativeButton]}
            onPress={handleNegativeFeedback}
            activeOpacity={0.8}
          >
            <Ionicons name="thumbs-down" size={28} color="#FFFFFF" />
            <Text style={styles.buttonText}>Not quite</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Negative Feedback Reason Modal */}
      <Modal
        visible={showReasonModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReasonModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: background }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: border }]}>
              <Text style={[styles.modalTitle, { color: text }]}>
                What didn't you like?
              </Text>
              <TouchableOpacity
                onPress={() => setShowReasonModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color={textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <ScrollView
              style={styles.optionsScroll}
              showsVerticalScrollIndicator={false}
            >
              {negativeFeedbackOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.optionItem, { backgroundColor: cardBackground }]}
                  onPress={() => handleReasonSelect(option.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[styles.optionIconContainer, { backgroundColor: background }]}
                  >
                    <Ionicons name={option.icon} size={24} color={textSecondary} />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionLabel, { color: text }]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.optionDescription, { color: textSecondary }]}>
                      {option.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: Radii.xl,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  title: {
    ...Typography.title3,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  feedbackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.lg,
    gap: Spacing.sm,
  },
  positiveButton: {
    backgroundColor: '#10B981',
  },
  negativeButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
  thankYouContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  thankYouText: {
    ...Typography.title3,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  thankYouSubtext: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.title2,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  optionsScroll: {
    padding: Spacing.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    marginBottom: Spacing.sm,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDescription: {
    ...Typography.caption,
  },
});

