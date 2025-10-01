import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { apiClient } from '../services/api/client';
import { deviceApi } from '../services/api/endpoints/device';
import { StorageUtils } from '../services/storage';
import type { RegisterDeviceRequest, UpdateDeviceRequest } from '../types/api';
import { getAppVersion, getDeviceId, getPlatform } from '../utils/device';

/**
 * Query keys for device-related queries
 */
export const deviceKeys = {
  all: ['device'] as const,
  current: () => [...deviceKeys.all, 'current'] as const,
  health: () => ['health'] as const,
};

/**
 * Hook for device registration
 * Automatically registers the device on mount if not already registered
 */
export function useDeviceRegistration() {
  const [isRegistered, setIsRegistered] = useState(false);

  // Check registration status on mount
  useEffect(() => {
    const checkRegistration = async () => {
      const token = await StorageUtils.getAuthToken();
      setIsRegistered(!!token);
    };
    checkRegistration();
  }, []);

  const registerMutation = useMutation({
    mutationFn: async () => {
      // Get or generate device ID
      let deviceId = await StorageUtils.getDeviceId();
      if (!deviceId) {
        deviceId = await getDeviceId();
        await StorageUtils.setDeviceId(deviceId);
      }

      // Get FCM token (placeholder for now - will be implemented with push notifications)
      const fcmToken = (await StorageUtils.getFcmToken()) || 'placeholder-fcm-token';

      // Prepare registration data
      const data: RegisterDeviceRequest = {
        deviceId,
        metadata: {
          platform: getPlatform(),
          fcmToken,
          appVersion: getAppVersion(),
        },
      };

      // Register device
      const response = await deviceApi.register(data);
      
      // Store auth token
      await apiClient.setAuthToken(response.token);

      return response;
    },
    onSuccess: (data) => {
      setIsRegistered(true);
      if (__DEV__) {
        console.log('[Device Registration] Success:', data.device.id);
      }
    },
    onError: (error) => {
      if (__DEV__) {
        console.error('[Device Registration] Error:', error);
      }
    },
  });

  // Auto-register on mount if no token exists
  useEffect(() => {
    if (!isRegistered && !registerMutation.isPending) {
      registerMutation.mutate();
    }
  }, [isRegistered]);

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    isRegistered,
    error: registerMutation.error,
  };
}

/**
 * Hook to get current device profile
 */
export function useCurrentDevice() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await StorageUtils.getAuthToken();
      setIsEnabled(!!token);
    };
    checkAuth();
  }, []);

  return useQuery({
    queryKey: deviceKeys.current(),
    queryFn: deviceApi.getCurrentDevice,
    enabled: isEnabled,
  });
}

/**
 * Hook to update device metadata
 */
export function useUpdateDevice() {
  return useMutation({
    mutationFn: async (metadata: UpdateDeviceRequest['metadata']) => {
      return deviceApi.updateMetadata({ metadata });
    },
    onSuccess: () => {
      if (__DEV__) {
        console.log('[Device Update] Success');
      }
    },
    onError: (error) => {
      if (__DEV__) {
        console.error('[Device Update] Error:', error);
      }
    },
  });
}

/**
 * Hook for health check
 */
export function useHealthCheck() {
  return useQuery({
    queryKey: deviceKeys.health(),
    queryFn: deviceApi.healthCheck,
    refetchInterval: 60000, // Check every minute
  });
}
