import { Spacing } from '@/constants/theme';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { InspirationCard } from './InspirationCard';

interface InspirationItem {
  id: string;
  title: string;
  prompt: string;
  imageUri: string;
  modelId?: string;
}

// Mock data - In production, this would come from an API or CMS
const INSPIRATION_DATA: InspirationItem[] = [
  {
    id: '1',
    title: 'Street Style',
    prompt: 'Modern street style outfit combination',
    imageUri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
  },
  {
    id: '2',
    title: 'Evening Glam',
    prompt: 'Romantic evening dinner outfit',
    imageUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    id: '3',
    title: 'Minimalist',
    prompt: 'Minimalist and chic daily outfit',
    imageUri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
  },
  {
    id: '4',
    title: 'Athletic',
    prompt: 'Sporty and elegant athletic style',
    imageUri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
  },
];

export const InspirationFeed = () => {
  const renderItem = ({ item }: { item: InspirationItem }) => (
    <View style={styles.itemContainer}>
      <InspirationCard {...item} />
    </View>
  );

  return (
    <FlatList
      data={INSPIRATION_DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  itemContainer: {
    flex: 1,
    maxWidth: '48%',
  },
});

