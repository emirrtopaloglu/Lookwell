import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import DemoPage from "@/components/onboarding/DemoPage";
import GetStartedPage from "@/components/onboarding/GetStartedPage";
import PaginationDots from "@/components/onboarding/PaginationDots";
import WelcomePage from "@/components/onboarding/WelcomePage";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOTAL_PAGES = 3;

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasCompleted = await AsyncStorage.getItem("hasCompletedOnboarding");
      if (hasCompleted === "true") {
        // User has already completed onboarding, redirect to home
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const handleGetStarted = () => {
    router.replace("/paywall");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.scrollView}
      >
        <WelcomePage />
        <DemoPage isActive={currentPage === 1} />
        <GetStartedPage onGetStarted={handleGetStarted} />
      </ScrollView>

      <View style={styles.paginationContainer}>
        <PaginationDots currentPage={currentPage} totalPages={TOTAL_PAGES} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  paginationContainer: {
    position: "absolute",
    bottom: Math.max(Spacing["2xl"], SCREEN_WIDTH * 0.08),
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
