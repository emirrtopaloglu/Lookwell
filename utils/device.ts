import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import type { Platform as ApiPlatform } from '../types/api';

/**
 * Get unique device identifier
 * Uses native device ID for iOS/Android, generates UUID for web
 */
export async function getDeviceId(): Promise<string> {
  if (Platform.OS === 'web') {
    // For web, use localStorage or generate UUID
    const storedId = localStorage.getItem('lookwell_device_id');
    if (storedId) return storedId;
    
    const newId = generateUUID();
    localStorage.setItem('lookwell_device_id', newId);
    return newId;
  }

  // For iOS/Android
  const id = Application.getIosIdForVendorAsync 
    ? await Application.getIosIdForVendorAsync()
    : Application.getAndroidId();
  
  return id || generateUUID();
}

/**
 * Get platform string for API
 */
export function getPlatform(): ApiPlatform {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
}

/**
 * Get app version
 */
export function getAppVersion(): string {
  return Application.nativeApplicationVersion || '1.0.0';
}

/**
 * Get device info for debugging
 */
export function getDeviceInfo() {
  return {
    brand: Device.brand,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    deviceType: Device.deviceType,
    platform: getPlatform(),
    appVersion: getAppVersion(),
  };
}

/**
 * Generate UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

