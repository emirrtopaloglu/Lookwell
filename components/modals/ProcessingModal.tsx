import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface ProcessingModalProps {
  isVisible: boolean;
}

const FUN_MESSAGES = [
  'Working magic...',
  'Our stylists are at work...',
  'AI brushes making final touches...',
  'Almost ready...',
  'Creating your perfect look...',
  'Transforming your style...',
];

export const ProcessingModal: React.FC<ProcessingModalProps> = ({ isVisible }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const textOnAccent = useThemeColor({}, 'textOnAccent');

  useEffect(() => {
    if (!isVisible) {
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % FUN_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <LottieView
            source={require('@/assets/Wardrobe.json')}
            autoPlay
            loop
            style={styles.animation}
          />
          
          <Text style={[styles.message, { color: textOnAccent }]}>
            {FUN_MESSAGES[messageIndex]}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  animation: {
    width: 240,
    height: 240,
    marginBottom: Spacing.xl,
  },
  message: {
    ...Typography.title3,
    textAlign: 'center',
  },
});

