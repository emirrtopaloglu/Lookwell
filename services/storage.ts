import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage keys
 */
export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  DEVICE_ID: 'device_id',
  FCM_TOKEN: 'fcm_token',
  FREE_TRIAL_COUNT: 'free_trial_count',
  USER_HAS_PRO: 'user_has_pro',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;

/**
 * Storage utility functions
 */
export const StorageUtils = {
  // Secure storage methods (for sensitive data like tokens)
  setAuthToken: async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(StorageKeys.AUTH_TOKEN, token);
  },

  getAuthToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(StorageKeys.AUTH_TOKEN);
  },

  removeAuthToken: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(StorageKeys.AUTH_TOKEN);
  },

  // Device ID (regular storage)
  setDeviceId: async (deviceId: string): Promise<void> => {
    await AsyncStorage.setItem(StorageKeys.DEVICE_ID, deviceId);
  },

  getDeviceId: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(StorageKeys.DEVICE_ID);
  },

  // FCM Token (regular storage)
  setFcmToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(StorageKeys.FCM_TOKEN, token);
  },

  getFcmToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(StorageKeys.FCM_TOKEN);
  },

  // Free trial count
  getFreeTrialCount: async (): Promise<number> => {
    const value = await AsyncStorage.getItem(StorageKeys.FREE_TRIAL_COUNT);
    return value ? parseInt(value, 10) : 0;
  },

  incrementFreeTrialCount: async (): Promise<void> => {
    const current = await StorageUtils.getFreeTrialCount();
    await AsyncStorage.setItem(StorageKeys.FREE_TRIAL_COUNT, (current + 1).toString());
  },

  // Pro status
  setUserHasPro: async (hasPro: boolean): Promise<void> => {
    await AsyncStorage.setItem(StorageKeys.USER_HAS_PRO, hasPro.toString());
  },

  getUserHasPro: async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(StorageKeys.USER_HAS_PRO);
    return value === 'true';
  },

  // Onboarding
  setOnboardingCompleted: async (completed: boolean): Promise<void> => {
    await AsyncStorage.setItem(StorageKeys.ONBOARDING_COMPLETED, completed.toString());
  },

  getOnboardingCompleted: async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(StorageKeys.ONBOARDING_COMPLETED);
    return value === 'true';
  },

  // Clear all data (logout)
  clearAll: async (): Promise<void> => {
    // Clear secure storage
    await SecureStore.deleteItemAsync(StorageKeys.AUTH_TOKEN);
    
    // Clear async storage
    const keys = [
      StorageKeys.DEVICE_ID,
      StorageKeys.FCM_TOKEN,
      StorageKeys.FREE_TRIAL_COUNT,
      StorageKeys.USER_HAS_PRO,
      StorageKeys.ONBOARDING_COMPLETED,
    ];
    await AsyncStorage.multiRemove(keys);
  },
};
