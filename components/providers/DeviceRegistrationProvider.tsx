import { useDeviceRegistration } from '@/hooks/useDeviceRegistration';
import { useEffect } from 'react';

/**
 * Provider component that handles device registration on app start
 * This component doesn't render anything, it just manages the side effect
 */
export function DeviceRegistrationProvider({ children }: { children: React.ReactNode }) {
  const { isRegistering, isRegistered, error } = useDeviceRegistration();

  useEffect(() => {
    if (error) {
      console.error('[Device Registration] Failed:', error);
      // In a production app, you might want to show an error UI or retry
    }
  }, [error]);

  useEffect(() => {
    if (isRegistered) {
      console.log('[Device Registration] Device is registered and ready');
    }
  }, [isRegistered]);

  // Render children immediately - registration happens in the background
  return <>{children}</>;
}

