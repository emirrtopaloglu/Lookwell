import { HeaderComponent } from '@/components/home/HeaderComponent';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SubscriptionCard } from '@/components/settings/SubscriptionCard';
import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCurrentDevice, useDeviceRegistration, useHealthCheck } from '@/hooks/useDeviceRegistration';
import { StorageUtils } from '@/services/storage';
import { getDeviceInfo } from '@/utils/device';
import * as MailComposer from 'expo-mail-composer';
import * as Sharing from 'expo-sharing';
import * as StoreReview from 'expo-store-review';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_VERSION = '1.0.0';
const PRIVACY_URL = 'https://lookwell.ai/privacy';
const TERMS_URL = 'https://lookwell.ai/terms';

const SettingsScreen = () => {
  const background = useThemeColor({}, 'background');
  const textMuted = useThemeColor({}, 'textMuted');
  const [isPro, setIsPro] = useState(false); // TODO: Get from Adapty
  
  // Developer hooks (only used in __DEV__)
  const { register, isRegistering, isRegistered } = useDeviceRegistration();
  const { data: healthData, refetch: refetchHealth, isLoading: isHealthLoading } = useHealthCheck();
  const { data: deviceData, refetch: refetchDevice } = useCurrentDevice();

  const handleSendFeedback = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    
    if (!isAvailable) {
      Alert.alert('Error', 'Email is not available on this device');
      return;
    }

    await MailComposer.composeAsync({
      recipients: ['feedback@lookwell.ai'],
      subject: 'Lookwell AI Feedback',
      body: 'Hi Lookwell Team,\n\n',
    });
  };

  const handleReportBug = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    
    if (!isAvailable) {
      Alert.alert('Error', 'Email is not available on this device');
      return;
    }

    await MailComposer.composeAsync({
      recipients: ['support@lookwell.ai'],
      subject: 'Lookwell AI Bug Report',
      body: 'Please describe the issue:\n\n',
    });
  };

  const handleRateApp = async () => {
    const isAvailable = await StoreReview.isAvailableAsync();
    
    if (isAvailable) {
      await StoreReview.requestReview();
    } else {
      Alert.alert('Error', 'Store review is not available on this device');
    }
  };

  const handleShareApp = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // TODO: Replace with actual app store URL
      await Sharing.shareAsync('https://lookwell.ai/download');
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleOpenPrivacy = async () => {
    await WebBrowser.openBrowserAsync(PRIVACY_URL);
  };

  const handleOpenTerms = async () => {
    await WebBrowser.openBrowserAsync(TERMS_URL);
  };

  const handleRestorePurchases = async () => {
    try {
      // TODO: Implement Adapty.restorePurchases()
      Alert.alert('Success', 'Purchases restored successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases');
      console.error('Restore error:', error);
    }
  };

  // Developer actions
  const handleCheckHealth = async () => {
    await refetchHealth();
    const status = healthData?.status || 'unknown';
    Alert.alert(
      'API Health Check',
      `Status: ${status}\nEnvironment: ${healthData?.environment || 'N/A'}\nUptime: ${healthData?.uptime || 'N/A'}s`
    );
  };

  const handleViewDevice = async () => {
    await refetchDevice();
    const info = getDeviceInfo();
    const deviceId = await StorageUtils.getDeviceId();
    
    Alert.alert(
      'Device Info',
      `Device ID: ${deviceId || 'Not set'}\n` +
      `Platform: ${info.platform}\n` +
      `OS: ${info.osName} ${info.osVersion}\n` +
      `Model: ${info.brand} ${info.modelName}\n` +
      `App Version: ${info.appVersion}\n` +
      `Registered: ${isRegistered ? 'Yes' : 'No'}`
    );
  };

  const handleReRegister = () => {
    Alert.alert(
      'Re-register Device',
      'This will create a new device registration. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Re-register',
          style: 'destructive',
          onPress: async () => {
            await StorageUtils.removeAuthToken();
            register();
          },
        },
      ]
    );
  };

  const handleClearStorage = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all app data including auth token. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await StorageUtils.clearAll();
            Alert.alert('Success', 'All data cleared. Please restart the app.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top', 'bottom']}>
      <HeaderComponent 
        title="Settings"
        subtitle="Manage your account"
        showGreeting={false}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscription Card */}
        <SubscriptionCard isPro={isPro} />

        {/* Support & Feedback Section */}
        <SettingsSection title="Support & Feedback">
          <SettingsRow
            iconName="send"
            label="Send Feedback"
            onPress={handleSendFeedback}
          />
          <SettingsRow
            iconName="bug"
            label="Report a Problem"
            onPress={handleReportBug}
          />
        </SettingsSection>

        {/* Support the App Section */}
        <SettingsSection title="Support the App">
          <SettingsRow
            iconName="star"
            label="Rate the App"
            onPress={handleRateApp}
          />
          <SettingsRow
            iconName="share-social"
            label="Share the App"
            onPress={handleShareApp}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsRow
            iconName="shield-checkmark"
            label="Privacy Policy"
            onPress={handleOpenPrivacy}
          />
          <SettingsRow
            iconName="document-text"
            label="Terms of Service"
            onPress={handleOpenTerms}
          />
          <SettingsRow
            iconName="refresh"
            label="Restore Purchases"
            onPress={handleRestorePurchases}
          />
        </SettingsSection>

        {/* Developer Section (Only in Development) */}
        {__DEV__ && (
          <SettingsSection title="🛠️ Developer Tools">
            <SettingsRow
              iconName="pulse"
              label="API Health Check"
              onPress={handleCheckHealth}
              rightElement={
                isHealthLoading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <View style={[styles.statusBadge, healthData?.status === 'ok' ? styles.statusOk : styles.statusError]}>
                    <Text style={styles.statusText}>{healthData?.status || '?'}</Text>
                  </View>
                )
              }
            />
            <SettingsRow
              iconName="phone-portrait"
              label="Device Info"
              onPress={handleViewDevice}
              rightElement={
                <View style={[styles.statusBadge, isRegistered ? styles.statusOk : styles.statusError]}>
                  <Text style={styles.statusText}>{isRegistered ? 'Registered' : 'Not Registered'}</Text>
                </View>
              }
            />
            <SettingsRow
              iconName="sync"
              label="Re-register Device"
              onPress={handleReRegister}
              rightElement={isRegistering ? <ActivityIndicator size="small" /> : undefined}
            />
            <SettingsRow
              iconName="trash"
              label="Clear All Data"
              onPress={handleClearStorage}
              destructive
            />
          </SettingsSection>
        )}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: textMuted }]}>
            Version {APP_VERSION}
          </Text>
          {__DEV__ && (
            <Text style={[styles.devModeText, { color: textMuted }]}>
              Development Mode
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['2xl'],
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  versionText: {
    ...Typography.caption,
  },
  devModeText: {
    ...Typography.caption,
    marginTop: Spacing['2xs'],
    fontSize: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOk: {
    backgroundColor: '#10B981',
  },
  statusError: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default SettingsScreen;

