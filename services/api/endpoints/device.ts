import type {
    CurrentDeviceResponse,
    HealthResponse,
    RegisterDeviceRequest,
    RegisterDeviceResponse,
    UpdateDeviceRequest,
} from '../../../types/api';
import { api } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Device API endpoints
 */
export const deviceApi = {
  /**
   * Register or upsert a device
   */
  register: async (data: RegisterDeviceRequest): Promise<RegisterDeviceResponse> => {
    const response = await api.post<RegisterDeviceResponse>(API_ENDPOINTS.DEVICE, data);
    return response.data;
  },

  /**
   * Update device metadata (requires authentication)
   */
  updateMetadata: async (data: UpdateDeviceRequest): Promise<CurrentDeviceResponse> => {
    const response = await api.put<CurrentDeviceResponse>(API_ENDPOINTS.DEVICE, data);
    return response.data;
  },

  /**
   * Get current device profile (requires authentication)
   */
  getCurrentDevice: async (): Promise<CurrentDeviceResponse> => {
    const response = await api.get<CurrentDeviceResponse>(API_ENDPOINTS.DEVICE);
    return response.data;
  },

  /**
   * Health check
   */
  healthCheck: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>(API_ENDPOINTS.HEALTH);
    return response.data;
  },
};

