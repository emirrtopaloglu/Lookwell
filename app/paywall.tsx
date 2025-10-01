import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import type { AdaptyPaywall, AdaptyProduct } from 'react-native-adapty';
import { adapty } from 'react-native-adapty';

import FreeTrialTimeline from '@/components/paywall/FreeTrialTimeline';
import OfferModal from '@/components/paywall/OfferModal';
import PackageOption from '@/components/paywall/PackageOption';
import PremiumFeatureItem from '@/components/paywall/PremiumFeatureItem';
import { Colors, Elevations, Radii, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PackageType = 'yearly' | 'monthly';

interface Package {
  id: PackageType;
  title: string;
  pricePerMonth: string;
  totalPrice: string;
  billingPeriod: string;
  savingsLabel?: string;
  isBestValue?: boolean;
  adaptyProduct?: AdaptyProduct;
}

interface PremiumFeature {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: 'infinite',
    title: 'Unlimited Tries',
    description: 'Try as many styles as you want, no limits',
  },
  {
    icon: 'sparkles',
    title: 'HD Quality Results',
    description: 'Get crystal-clear, high-resolution images',
  },
  {
    icon: 'eye-off-outline',
    title: 'No Watermarks',
    description: 'Clean images ready to share anywhere',
  },
  {
    icon: 'shirt',
    title: 'Exclusive Style Packs',
    description: 'Access premium fashion collections first',
  },
];

export default function PaywallScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('yearly');
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [paywall, setPaywall] = useState<AdaptyPaywall | null>(null);
  const [discountProduct, setDiscountProduct] = useState<AdaptyProduct | null>(null);

  useEffect(() => {
    fetchPaywallData();
  }, []);

  const fetchPaywallData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch paywall from Adapty
      const fetchedPaywall = await adapty.getPaywall('default');
      setPaywall(fetchedPaywall);

      // Fetch products associated with the paywall
      const products = await adapty.getPaywallProducts(fetchedPaywall);

      // Map products to package options
      const mappedPackages: Package[] = [];

      products.forEach((product) => {
        // Identify product type based on subscription period
        const subscriptionPeriod = product.subscriptionPeriod?.unit?.toLowerCase();
        
        if (subscriptionPeriod === 'year' || product.vendorProductId.includes('year')) {
          mappedPackages.push({
            id: 'yearly',
            title: 'Yearly',
            pricePerMonth: calculateMonthlyPrice(product.price, 12),
            totalPrice: product.localizedPrice || '$59.99',
            billingPeriod: `Billed annually • ${product.localizedPrice || '$59.99'}`,
            savingsLabel: 'Save 38%',
            isBestValue: true,
            adaptyProduct: product,
          });
        } else if (subscriptionPeriod === 'month' || product.vendorProductId.includes('month')) {
          mappedPackages.push({
            id: 'monthly',
            title: 'Monthly',
            pricePerMonth: product.localizedPrice || '$7.99',
            totalPrice: product.localizedPrice || '$7.99',
            billingPeriod: 'Billed monthly',
            adaptyProduct: product,
          });
        }
      });

      // Fallback to default packages if no products found
      if (mappedPackages.length === 0) {
        mappedPackages.push(
          {
            id: 'yearly',
            title: 'Yearly',
            pricePerMonth: '$4.99',
            totalPrice: '$59.99',
            billingPeriod: 'Billed annually • $59.99',
            savingsLabel: 'Save 38%',
            isBestValue: true,
          },
          {
            id: 'monthly',
            title: 'Monthly',
            pricePerMonth: '$7.99',
            totalPrice: '$7.99',
            billingPeriod: 'Billed monthly',
          }
        );
      }

      setPackages(mappedPackages);
    } catch (error) {
      console.error('Error fetching paywall data:', error);
      
      // Use fallback packages on error
      setPackages([
        {
          id: 'yearly',
          title: 'Yearly',
          pricePerMonth: '$4.99',
          totalPrice: '$59.99',
          billingPeriod: 'Billed annually • $59.99',
          savingsLabel: 'Save 38%',
          isBestValue: true,
        },
        {
          id: 'monthly',
          title: 'Monthly',
          pricePerMonth: '$7.99',
          totalPrice: '$7.99',
          billingPeriod: 'Billed monthly',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMonthlyPrice = (yearlyPrice: number, months: number): string => {
    const monthlyAmount = yearlyPrice / months;
    return `$${monthlyAmount.toFixed(2)}`;
  };

  const handleClose = () => {
    // Show offer modal when user tries to close
    setOfferModalVisible(true);
  };

  const handleStartTrial = async () => {
    const selectedPkg = packages.find((pkg) => pkg.id === selectedPackage);
    
    if (!selectedPkg?.adaptyProduct) {
      Alert.alert('Error', 'Product not available. Please try again.');
      return;
    }

    try {
      const profile = await adapty.makePurchase(selectedPkg.adaptyProduct);
      
      // Check if purchase was successful
      if (profile) {
        Alert.alert(
          'Success!',
          'Your trial has started. Enjoy premium features!',
          [
            {
              text: 'Get Started',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      }
    } catch (error: any) {
      if (error.adaptyCode !== 'userCancelled') {
        Alert.alert('Purchase Failed', 'Something went wrong. Please try again.');
        console.error('Purchase error:', error);
      }
    }
  };

  const handleRestorePurchases = async () => {
    try {
      const profile = await adapty.restorePurchases();
      
      // Check if user has active subscriptions
      const hasAccess = profile.accessLevels?.premium?.isActive;
      
      if (hasAccess) {
        Alert.alert(
          'Success!',
          'Your purchases have been restored.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        Alert.alert('No Purchases Found', 'You have no previous purchases to restore.');
      }
    } catch (error) {
      Alert.alert('Restore Failed', 'Unable to restore purchases. Please try again.');
      console.error('Restore error:', error);
    }
  };

  const handleOfferAccept = async () => {
    setOfferModalVisible(false);
    
    // Use the discounted yearly product if available
    const yearlyPackage = packages.find((pkg) => pkg.id === 'yearly');
    
    if (yearlyPackage?.adaptyProduct) {
      try {
        const profile = await adapty.makePurchase(yearlyPackage.adaptyProduct);
        
        if (profile) {
          Alert.alert(
            'Success!',
            'Thank you for subscribing with the exclusive discount!',
            [
              {
                text: 'Get Started',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
        }
      } catch (error: any) {
        if (error.adaptyCode !== 'userCancelled') {
          Alert.alert('Purchase Failed', 'Something went wrong. Please try again.');
          console.error('Offer purchase error:', error);
        }
      }
    }
  };

  const handleOfferDecline = () => {
    setOfferModalVisible(false);
    router.replace('/(tabs)');
  };

  const selectedPkgData = packages.find((pkg) => pkg.id === selectedPackage);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={28} color={colors.text} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={[styles.iconContainer, { backgroundColor: colors.accentSoft }]}>
            <Ionicons name="diamond" size={48} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Unlock Your Style
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Transform your wardrobe with unlimited AI-powered try-ons
          </Text>
        </View>

        {/* Premium Features */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}> 
            Premium Features
          </Text>
          <View style={styles.featuresContainer}>
            {premiumFeatures.map((feature, index) => (
              <PremiumFeatureItem key={index} feature={feature} />
            ))}
          </View>
        </View>

        {/* Package Options */}
        {!isLoading && packages.length > 0 && (
          <View style={styles.packagesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Choose Your Plan
            </Text>
            <View style={styles.packagesContainer}>
              {packages.map((pkg) => (
                <PackageOption
                  key={pkg.id}
                  package={pkg}
                  isSelected={selectedPackage === pkg.id}
                  onSelect={() => setSelectedPackage(pkg.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Free Trial Timeline (moved down) */}
        <View style={styles.timelineSection}>
          <FreeTrialTimeline />
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[
            styles.ctaButton,
            { backgroundColor: colors.accent },
            Platform.OS === 'ios' && Elevations.level2,
            isLoading && styles.ctaButtonDisabled,
          ]}
          onPress={handleStartTrial}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Text style={[styles.ctaButtonText, { color: colors.textOnAccent }]}>
            {isLoading ? 'Loading...' : 'Start Your 3-Day Free Trial'}
          </Text>
        </TouchableOpacity>

        {/* Trial Terms */}
        {selectedPkgData && (
          <Text style={[styles.termsText, { color: colors.textMuted }]}>
            Free for 3 days, then {selectedPkgData.totalPrice}
            {selectedPackage === 'yearly' ? '/year' : '/month'}.
            {'\n'}Cancel anytime before trial ends.
          </Text>
        )}

        {/* Restore Purchases Button */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          activeOpacity={0.7}
        >
          <Text style={[styles.restoreButtonText, { color: colors.textSecondary }]}>
            Restore Purchases
          </Text>
        </TouchableOpacity>

        {/* Legal Links */}
        <View style={styles.legalLinksContainer}>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[styles.legalLink, { color: colors.textMuted }]}>
              Terms of Service
            </Text>
          </TouchableOpacity>
          <Text style={[styles.legalSeparator, { color: colors.textMuted }]}>•</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[styles.legalLink, { color: colors.textMuted }]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Offer Modal */}
      <OfferModal
        visible={offerModalVisible}
        onAccept={handleOfferAccept}
        onDecline={handleOfferDecline}
        discountPercentage={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: Spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.display,
    fontSize: Math.min(Typography.display.fontSize, SCREEN_WIDTH * 0.095),
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    fontSize: Math.min(Typography.body.fontSize, SCREEN_WIDTH * 0.04),
    textAlign: 'center',
    maxWidth: SCREEN_WIDTH * 0.75,
  },
  timelineSection: {
    marginBottom: Spacing['2xl'],
  },
  packagesSection: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    ...Typography.title3,
    fontSize: Math.min(Typography.title3.fontSize, SCREEN_WIDTH * 0.048),
    marginBottom: Spacing.md,
  },
  packagesContainer: {
    gap: Spacing.md,
  },
  featuresSection: {
    marginBottom: Spacing['2xl'],
  },
  featuresContainer: {
    gap: Spacing.md,
  },
  ctaButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginBottom: Spacing.md,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaButtonText: {
    ...Typography.button,
    fontSize: Math.min(18, SCREEN_WIDTH * 0.048),
  },
  termsText: {
    ...Typography.bodySmall,
    fontSize: Math.min(Typography.bodySmall.fontSize, SCREEN_WIDTH * 0.032),
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.xl,
  },
  restoreButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  restoreButtonText: {
    ...Typography.bodyStrong,
    fontSize: Math.min(Typography.bodyStrong.fontSize, SCREEN_WIDTH * 0.04),
  },
  legalLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  legalLink: {
    ...Typography.caption,
    fontSize: Math.min(Typography.caption.fontSize, SCREEN_WIDTH * 0.03),
  },
  legalSeparator: {
    ...Typography.caption,
    fontSize: Math.min(Typography.caption.fontSize, SCREEN_WIDTH * 0.03),
  },
});