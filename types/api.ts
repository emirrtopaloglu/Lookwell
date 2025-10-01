/**
 * API Types based on OpenAPI specification
 */

export type Platform = 'ios' | 'android' | 'web';

export interface DeviceMetadata {
  platform: Platform;
  fcmToken: string;
  appVersion: string;
}

export interface RegisterDeviceRequest {
  deviceId: string;
  metadata: DeviceMetadata;
}

export interface UpdateDeviceRequest {
  metadata: DeviceMetadata;
}

export interface Device {
  id: string;
  deviceId: string;
  metadata: DeviceMetadata;
  registeredAt: string;
  lastSeen: string;
}

export interface RegisterDeviceResponse {
  token: string;
  device: Device;
}

export interface CurrentDeviceResponse {
  device: Device;
}

export interface HealthResponse {
  status: 'ok';
  environment: 'development' | 'test' | 'production';
  uptime: number;
  timestamp: string;
}

export interface ErrorResponse {
  message: string;
  details?: unknown;
}

