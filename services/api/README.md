# Lookwell API Integration

## 📋 Overview

Bu dizin, Lookwell uygulamasının backend API entegrasyonunu içerir. Axios ve TanStack React Query kullanılarak oluşturulmuştur.

## 🏗️ Architecture

```
services/api/
├── client.ts              # Axios instance ve interceptorlar
├── config.ts              # API konfigürasyonu
├── endpoints/
│   └── device.ts          # Device registration endpoints
└── README.md

Related files:
├── types/api.ts           # API type definitions
├── hooks/useDeviceRegistration.ts  # Device registration hooks
├── providers/QueryProvider.tsx     # React Query provider
└── utils/device.ts        # Device utility functions
```

## 🚀 Features

### ✅ Axios Setup
- **Base Configuration**: Timeout, base URL, headers
- **Request Interceptor**: Otomatik token ekleme
- **Response Interceptor**: Hata yönetimi, 401 handling
- **Development Logging**: Request/response logları

### ✅ Storage Management
- **Expo SecureStore**: Hassas veriler (tokens) için güvenli storage
- **AsyncStorage**: Genel uygulama verisi için performanslı storage
- **Utility Functions**: Ready-to-use async storage helpers

### ✅ Device Registration
- **Auto Registration**: Uygulama başlangıcında otomatik kayıt
- **Platform Detection**: iOS, Android, Web desteği
- **Token Management**: JWT token saklama ve yönetimi

### ✅ React Query Integration
- **Query Client**: Optimized caching stratejisi
- **Custom Hooks**: useDeviceRegistration, useCurrentDevice
- **Automatic Refetching**: Stale-while-revalidate pattern

## 📝 API Endpoints

### Device Registration
```typescript
POST /v1/device
Request: {
  deviceId: string;
  metadata: {
    platform: 'ios' | 'android' | 'web';
    fcmToken: string;
    appVersion: string;
  }
}
Response: {
  token: string;
  device: Device;
}
```

### Update Device
```typescript
PUT /v1/device (requires auth)
Request: {
  metadata: DeviceMetadata;
}
Response: {
  device: Device;
}
```

### Get Current Device
```typescript
GET /v1/device (requires auth)
Response: {
  device: Device;
}
```

### Health Check
```typescript
GET /v1/health
Response: {
  status: 'ok';
  environment: string;
  uptime: number;
  timestamp: string;
}
```

## 💻 Usage

### Basic API Call
```typescript
import { deviceApi } from '@/services/api/endpoints/device';

// Register device
const response = await deviceApi.register({
  deviceId: 'unique-device-id',
  metadata: {
    platform: 'ios',
    fcmToken: 'fcm-token',
    appVersion: '1.0.0'
  }
});
```

### Using Hooks
```typescript
import { useDeviceRegistration } from '@/hooks/useDeviceRegistration';

function MyComponent() {
  const { isRegistering, isRegistered, error } = useDeviceRegistration();
  
  if (isRegistering) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  
  return <MainContent />;
}
```

### Manual Registration
```typescript
import { useDeviceRegistration } from '@/hooks/useDeviceRegistration';

function SettingsScreen() {
  const { register } = useDeviceRegistration();
  
  const handleReRegister = () => {
    register();
  };
  
  return <Button onPress={handleReRegister}>Re-register Device</Button>;
}
```

## 🔐 Security

- ✅ API keys **asla** client-side'da tutulmuyor
- ✅ JWT tokens Expo SecureStore ile güvenli saklanıyor
- ✅ Interceptor ile otomatik token ekleniyor (async)
- ✅ 401 durumunda token temizleniyor

## 🧪 Testing

Backend'in çalıştığını test etmek için:

```typescript
import { useHealthCheck } from '@/hooks/useDeviceRegistration';

function HealthCheckButton() {
  const { data, refetch } = useHealthCheck();
  
  return (
    <View>
      <Text>Status: {data?.status}</Text>
      <Button onPress={() => refetch()}>Check Health</Button>
    </View>
  );
}
```

## 📦 Dependencies

- `axios`: HTTP client
- `@tanstack/react-query`: Server state management
- `expo-secure-store`: Secure storage for sensitive data (tokens)
- `@react-native-async-storage/async-storage`: Async storage for app data
- `expo-application`: App version ve device ID
- `expo-device`: Device information

## 🔄 Flow

1. **App Launch**: QueryProvider ve DeviceRegistrationProvider mount olur
2. **Auto Registration**: useDeviceRegistration hook deviceId kontrol eder (async)
3. **Device ID**: AsyncStorage'dan kontrol, yoksa generate eder
4. **API Call**: POST /v1/device ile backend'e kayıt
5. **Token Storage**: Dönen token SecureStore'a güvenli kaydedilir
6. **Ready**: Uygulama API çağrılarına hazır (tüm storage async)

## 🎯 Next Steps

- [ ] FCM token integration (push notifications)
- [ ] Retry logic için exponential backoff
- [ ] Offline support ve queue system
- [ ] Analytics event tracking
- [ ] Error reporting (Sentry integration)

## 🐛 Troubleshooting

### "Network error" hatası alıyorum
- Backend'in çalıştığından emin olun: `http://localhost:3000`
- iOS simulator için localhost yerine IP kullanmanız gerekebilir
- Android emulator için `10.0.2.2:3000` kullanın

### Token kayboldu
```typescript
import { StorageUtils } from '@/services/storage';
await StorageUtils.clearAll(); // Tüm storage'ı temizle (async!)
// Uygulamayı yeniden başlat
```

**Not**: Tüm StorageUtils fonksiyonları async! `await` kullanmayı unutmayın.

### Device registration fails
- Network bağlantısını kontrol edin
- Backend logs'larına bakın
- Console'da detaylı error mesajlarını inceleyin

