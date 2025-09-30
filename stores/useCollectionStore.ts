import { CollectionItem } from '@/types/collection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CollectionStore {
  looks: CollectionItem[];
  addLook: (look: CollectionItem) => void;
  removeLook: (id: string) => void;
}

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set) => ({
      looks: [],
      addLook: (look) =>
        set((state) => ({
          looks: [look, ...state.looks], // Add to beginning for newest first
        })),
      removeLook: (id) =>
        set((state) => ({
          looks: state.looks.filter((look) => look.id !== id),
        })),
    }),
    {
      name: 'lookwell-collection',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

