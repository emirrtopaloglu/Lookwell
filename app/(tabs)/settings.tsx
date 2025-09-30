import { HeaderComponent } from '@/components/home/HeaderComponent';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SubscriptionCard } from '@/components/settings/SubscriptionCard';
import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as MailComposer from 'expo-mail-composer';
import * as Sharing from 'expo-sharing';
import * as StoreReview from 'expo-store-review';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_VERSION = '1.0.0';
const PRIVACY_URL = 'https://lookwell.ai/privacy';
const TERMS_URL = 'https://lookwell.ai/terms';

const SettingsScreen = () => {
  const background = useThemeColor({}, 'background');
  const textMuted = useThemeColor({}, 'textMuted');
  const [isPro, setIsPro] = useState(false); // TODO: Get from Adapty

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

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: textMuted }]}>
            Version {APP_VERSION}
          </Text>
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
});

export default SettingsScreen;

