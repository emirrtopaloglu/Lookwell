/**
 * API Configuration
 */

// TODO: Move to .env file
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  HEALTH: '/v1/health',
  DEVICE: '/v1/device',
  DEVICE_PROFILE: '/v1/device/profile',
} as const;

