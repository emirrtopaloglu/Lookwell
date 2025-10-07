import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // Geçici yoruma alındı
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
// import { adapty } from "react-native-adapty"; // Geçici yoruma alındı
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { QueryProvider } from "@/providers/QueryProvider";
import { fal } from "@fal-ai/client";
import { adapty } from 'react-native-adapty';

adapty.activate('public_live_1wKaDWI1.M4wFuy9A5hooeZfujzWH');

fal.config({
  credentials: process.env.EXPO_PUBLIC_FAL_API_KEY,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // GEÇİCİ: Adapty devre dışı - geçersiz API key crash'e neden oluyordu
      // Gerçek API key eklenince yorumları kaldırın

      /*
      // Initialize Adapty SDK
      // Replace 'YOUR_PUBLIC_SDK_KEY' with your actual Adapty public SDK key
      await adapty.activate("PUBLIC_SDK_KEY_TO_BE_REPLACED", {
        observerMode: false,
      });

      // Pre-fetch paywall data
      try {
        await adapty.getPaywall("default");
      } catch (error) {
        console.log("Paywall pre-fetch failed:", error);
      }
      */

      console.log("App initialized without Adapty (testing mode)");
    } catch (error) {
      console.error("Failed to initialize:", error);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <QueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="(onboarding)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="paywall"
              options={{ presentation: "fullScreenModal", headerShown: false }}
            />
            <Stack.Screen
              name="create/index"
              options={{ headerShown: false }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryProvider>
  );
}
