import { FeedbackItem } from '@/types/feedback';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FeedbackStore {
  feedbacks: FeedbackItem[];
  addFeedback: (feedback: FeedbackItem) => void;
  getFeedbackStats: () => {
    total: number;
    positive: number;
    negative: number;
    positiveRate: number;
  };
}

export const useFeedbackStore = create<FeedbackStore>()(
  persist(
    (set, get) => ({
      feedbacks: [],
      
      addFeedback: (feedback) => {
        set((state) => ({ 
          feedbacks: [...state.feedbacks, feedback] 
        }));
      },
      
      getFeedbackStats: () => {
        const { feedbacks } = get();
        const total = feedbacks.length;
        const positive = feedbacks.filter(f => f.feedbackType === 'positive').length;
        const negative = feedbacks.filter(f => f.feedbackType === 'negative').length;
        const positiveRate = total > 0 ? (positive / total) * 100 : 0;
        
        return { total, positive, negative, positiveRate };
      },
    }),
    {
      name: 'lookwell-feedback',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

