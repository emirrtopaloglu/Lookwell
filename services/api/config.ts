/**
 * API Configuration
 */

// TODO: Move to .env file
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  HEALTH: '/v1/health',
  DEVICE: '/v1/device',
} as const;

