import { DismissHeader } from '@/components/create/DismissHeader';
import { GenerateButton } from '@/components/create/GenerateButton';
import { PromptPreview } from '@/components/create/PromptPreview';
import { UploaderSection } from '@/components/create/UploaderSection';
import { ProcessingModal } from '@/components/modals/ProcessingModal';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateScreen = () => {
  const params = useLocalSearchParams<{ prompt?: string; modelId?: string }>();
  const router = useRouter();
  const background = useThemeColor({}, 'background');

  const [userImageUri, setUserImageUri] = useState<string | undefined>();
  const [clothingImageUri, setClothingImageUri] = useState<string | undefined>();
  const [clothingText, setClothingText] = useState<string>('');
  const [finalPrompt, setFinalPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Pre-fill prompt from navigation params
  useEffect(() => {
    if (params.prompt) {
      setFinalPrompt(params.prompt);
    }
  }, [params.prompt]);

  // Update final prompt based on inputs
  useEffect(() => {
    if (clothingText) {
      setFinalPrompt(clothingText);
    } else if (params.prompt) {
      setFinalPrompt(params.prompt);
    } else {
      setFinalPrompt('');
    }
  }, [clothingText, params.prompt]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Gallery access permission is required to select photos.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async (type: 'user' | 'clothing') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: type === 'user' ? [3, 4] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === 'user') {
        setUserImageUri(result.assets[0].uri);
      } else {
        setClothingImageUri(result.assets[0].uri);
        // Clear text input when image is selected
        setClothingText('');
      }
    }
  };

  const handleUserImagePress = () => {
    pickImage('user');
  };

  const handleClothingImagePress = () => {
    pickImage('clothing');
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // TODO: Implement actual AI generation
    // This will be connected to the Cloudflare Worker and Fal.ai API
    console.log('Generating with:', {
      userImage: userImageUri,
      clothingImage: clothingImageUri,
      prompt: finalPrompt,
      modelId: params.modelId,
    });

    // Simulate processing and navigate to result
    setTimeout(() => {
      setIsGenerating(false);
      
      // Navigate to result screen with demo data
      router.push({
        pathname: '/result',
        params: {
          originalImageUri: userImageUri,
          generatedImageUri: userImageUri, // In demo, using same image
          prompt: finalPrompt,
        },
      });
    }, 5000); // 5 seconds to show the processing modal
  };

  const canGenerate = Boolean(
    userImageUri && (clothingImageUri || clothingText)
  );

  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'modal',
          headerShown: false,
          animation: 'slide_from_bottom',
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top', 'bottom']}>
        <DismissHeader title="Create New Look" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <UploaderSection
            userImageUri={userImageUri}
            clothingImageUri={clothingImageUri}
            clothingText={clothingText}
            onUserImagePress={handleUserImagePress}
            onClothingImagePress={handleClothingImagePress}
            onClothingTextChange={setClothingText}
          />

          <PromptPreview prompt={finalPrompt} />
        </ScrollView>

        <GenerateButton
          onPress={handleGenerate}
          disabled={!canGenerate}
          loading={isGenerating}
        />

        {/* Processing Modal */}
        <ProcessingModal isVisible={isGenerating} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
});

export default CreateScreen;

