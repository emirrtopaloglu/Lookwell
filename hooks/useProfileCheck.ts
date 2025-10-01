import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useCurrentDevice } from './useDeviceRegistration';

/**
 * Hook to check if user has completed their profile
 * Redirects to profile-setup if profile is incomplete
 */
export function useProfileCheck(options?: { enabled?: boolean; redirect?: boolean }) {
  const { enabled = true, redirect = true } = options || {};
  const router = useRouter();
  const { data: deviceData, isLoading } = useCurrentDevice();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    if (!enabled || isLoading) return;

    if (deviceData?.device) {
      const profile = deviceData.device.profile as
        | { name?: string; gender?: string; ageRange?: string; stylePreferences?: string[] }
        | null
        | undefined;
      const profileComplete = !!(
        profile &&
        profile.name &&
        profile.gender &&
        profile.ageRange &&
        Array.isArray(profile.stylePreferences) &&
        profile.stylePreferences.length > 0
      );

      setHasProfile(profileComplete);

      // Redirect to profile setup if profile is incomplete
      if (redirect && !profileComplete) {
        router.replace('/profile-setup');
      }
    }
  }, [deviceData, isLoading, enabled, redirect, router]);

  return {
    hasProfile,
    isCheckingProfile: isLoading,
    profile: (deviceData?.device as any)?.profile,
  };
}

