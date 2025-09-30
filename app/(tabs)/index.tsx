import { StyleSpotlightCard } from '@/components/home/DailyLookCard';
import { FloatingActionButton } from '@/components/home/FloatingActionButton';
import { HeaderComponent } from '@/components/home/HeaderComponent';
import { InspirationFeed } from '@/components/home/InspirationFeed';
import { QuickActionCard } from '@/components/home/QuickActionCard';
import { SectionHeader } from '@/components/home/SectionHeader';
import { StatsBar } from '@/components/home/StatsBar';
import { TextStyleCard } from '@/components/home/TextStyleCard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const background = useThemeColor({}, 'background');
  const router = useRouter();

  const handleQuickTryOn = () => {
    router.push('/create');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top', 'bottom']}>
      <HeaderComponent />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StyleSpotlightCard />
        
        <StatsBar />

        <SectionHeader 
          title="Quick Actions" 
          subtitle="Get started in seconds"
        />
        
        <View style={styles.quickActionsRow}>
          <QuickActionCard
            title="Virtual Try-On"
            description="Upload and see instantly"
            icon="camera"
            onPress={handleQuickTryOn}
          />
          <QuickActionCard
            title="AI Stylist"
            description="Get personalized tips"
            icon="sparkles"
            onPress={handleQuickTryOn}
          />
        </View>

        <SectionHeader 
          title="Trending Styles" 
          subtitle="What's popular this week"
        />
        
        <TextStyleCard
          id="casual-weekend"
          title="Casual Weekend"
          description="Relaxed and comfortable everyday outfits"
          prompt="Casual weekend outfit with comfortable and relaxed style"
          icon="cafe"
          accentColor="#F59E0B"
        />
        
        <TextStyleCard
          id="date-night"
          title="Date Night"
          description="Romantic and stylish evening looks"
          prompt="Elegant date night outfit with romantic styling"
          icon="heart"
          accentColor="#EC4899"
        />
        
        <TextStyleCard
          id="business-casual"
          title="Business Casual"
          description="Professional yet approachable work attire"
          prompt="Business casual outfit for modern workplace"
          icon="briefcase"
          accentColor="#3B82F6"
        />

        <SectionHeader 
          title="Explore More" 
          subtitle="Discover your perfect style"
        />
        
        <InspirationFeed />
      </ScrollView>

      <FloatingActionButton />
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
    paddingBottom: 120,
  },
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
});

export default HomeScreen;