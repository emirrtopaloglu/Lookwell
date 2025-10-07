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
import Constants from "expo-constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { QueryProvider } from "@/providers/QueryProvider";
import { fal } from "@fal-ai/client";
import { adapty } from "react-native-adapty";

fal.config({
  credentials: process.env.EXPO_PUBLIC_FAL_API_KEY,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

// Global flag to ensure Adapty is only activated once
let adaptyInitialized = false;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Only initialize Adapty if not already initialized
      const ADAPTY_API_KEY =
        process.env.EXPO_PUBLIC_ADAPTY_API_KEY ||
        Constants?.expoConfig?.extra?.ADAPTY_API_KEY;
      if (!ADAPTY_API_KEY) {
        console.error("Adapty API key is missing in environment variables.");
        setIsReady(true);
        return;
      }
      if (!adaptyInitialized) {
        console.log("Initializing Adapty SDK...");
        await adapty.activate(ADAPTY_API_KEY, {
          observerMode: false,
        });
        adaptyInitialized = true;
        console.log("Adapty initialized successfully");
      } else {
        console.log("Adapty already initialized, skipping...");
      }

      // Pre-fetch paywall data
      try {
        await adapty.getPaywall("default");
        console.log("Paywall pre-fetch successful");
      } catch (error) {
        console.log("Paywall pre-fetch failed:", error);
      }
    } catch (error: any) {
      console.error("Failed to initialize Adapty:", error);
      // If it's the double activation error, mark as initialized to prevent further attempts
      if (error?.message?.includes("can only be activated once")) {
        console.log(
          "Adapty was already activated elsewhere, marking as initialized"
        );
        adaptyInitialized = true;
      }
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
