import { Elevations, Radii, Spacing } from '@/constants/theme';
import { CollectionItem } from '@/types/collection';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

interface StyleCardProps {
  item: CollectionItem;
}

export const StyleCard: React.FC<StyleCardProps> = ({ item }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/collectionDetail',
      params: {
        id: item.id,
        imageUri: item.imageUri,
        prompt: item.prompt || '',
        createdAt: item.createdAt,
      },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, Elevations.level1]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.imageUri }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: Radii.md,
    overflow: 'hidden',
    aspectRatio: 3 / 4,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

