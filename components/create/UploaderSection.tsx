import { Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ClothingInput } from './ClothingInput';
import { ImageUploader } from './ImageUploader';
import { PrivacyNotice } from './PrivacyNotice';

interface UploaderSectionProps {
  userImageUri?: string;
  clothingImageUri?: string;
  clothingText: string;
  onUserImagePress: () => void;
  onClothingImagePress: () => void;
  onClothingTextChange: (text: string) => void;
  onClearUserImage: () => void;
  onClearClothingImage: () => void;
}

export const UploaderSection: React.FC<UploaderSectionProps> = ({
  userImageUri,
  clothingImageUri,
  clothingText,
  onUserImagePress,
  onClothingImagePress,
  onClothingTextChange,
  onClearUserImage,
  onClearClothingImage,
}) => {

  return (
    <View style={styles.container}>
      <PrivacyNotice />
      
      <View style={styles.row}>
        <ImageUploader
          label="1. Your Photo"
          imageUri={userImageUri}
          onPress={onUserImagePress}
          onClear={userImageUri ? onClearUserImage : undefined}
          placeholder="Upload Your Photo"
          hint="Tip: A clear and well-lit portrait photo gives the best results."
        />
      </View>

      <View style={styles.row}>
        <View style={styles.clothingContainer}>
          <ImageUploader
            label="2. Clothing Photo (Optional)"
            imageUri={clothingImageUri}
            onPress={onClothingImagePress}
            onClear={clothingImageUri ? onClearClothingImage : undefined}
            placeholder="Upload Clothing Photo"
          />
          
          {!clothingImageUri && (
            <ClothingInput
              value={clothingText}
              onChangeText={onClothingTextChange}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.lg,
  },
  row: {
    gap: Spacing.sm,
  },
  clothingContainer: {
    flex: 1,
  },
});

