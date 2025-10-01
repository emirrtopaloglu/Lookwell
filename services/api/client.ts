import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { StorageUtils } from '../storage';
import { API_CONFIG } from './config';

/**
 * Axios instance with interceptors for authentication and error handling
 */
class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: Add auth token if available
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await StorageUtils.getAuthToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (__DEV__) {
          console.log(
            `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
            config.data ? { data: config.data } : ''
          );
        }

        return config;
      },
      (error) => {
        if (__DEV__) {
          console.error('[API Request Error]', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle common errors
    this.instance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (__DEV__) {
          console.log(
            `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
            { status: response.status, data: response.data }
          );
        }

        return response;
      },
      async (error) => {
        if (__DEV__) {
          console.error('[API Response Error]', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
          });
        }

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {
          // Clear invalid token
          await StorageUtils.removeAuthToken();
          
          // You might want to trigger re-authentication or navigation to login
          // This can be implemented via a callback or event emitter
        }

        // Handle network errors
        if (!error.response) {
          return Promise.reject({
            message: 'Network error. Please check your internet connection.',
            isNetworkError: true,
          });
        }

        // Return formatted error
        return Promise.reject({
          message: error.response?.data?.message || 'An error occurred',
          status: error.response?.status,
          details: error.response?.data?.details,
        });
      }
    );
  }

  /**
   * Get the axios instance
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Update auth token
   */
  async setAuthToken(token: string): Promise<void> {
    await StorageUtils.setAuthToken(token);
  }

  /**
   * Clear auth token
   */
  async clearAuthToken(): Promise<void> {
    await StorageUtils.removeAuthToken();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export const api = apiClient.getInstance();
