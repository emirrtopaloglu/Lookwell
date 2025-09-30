import { EmptyStateComponent } from '@/components/collection/EmptyStateComponent';
import { StyleCard } from '@/components/collection/StyleCard';
import { HeaderComponent } from '@/components/home/HeaderComponent';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCollectionStore } from '@/stores/useCollectionStore';
import { CollectionItem } from '@/types/collection';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CollectionScreen = () => {
  const background = useThemeColor({}, 'background');
  const looks = useCollectionStore((state) => state.looks);

  const renderItem = ({ item }: { item: CollectionItem }) => (
    <View style={styles.itemContainer}>
      <StyleCard item={item} />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top', 'bottom']}>
      <HeaderComponent 
        title="Style Panel"
        subtitle="Your Saved Looks"
        showGreeting={false}
      />
      
      {looks.length === 0 ? (
        <EmptyStateComponent />
      ) : (
        <FlatList
          data={looks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['2xl'],
  },
  row: {
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  itemContainer: {
    flex: 1,
    maxWidth: '48%',
  },
});

export default CollectionScreen;

