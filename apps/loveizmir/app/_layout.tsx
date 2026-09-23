import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MasterAiFab } from "@/components/MasterAiFab";
import { MasterAiSheet } from "@/components/MasterAiSheet";
import { BlogProvider } from "@/contexts/BlogContext";
import { AiBrainProvider } from "@/contexts/AiBrainContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ListingsProvider } from "@/contexts/ListingsContext";
import { LoveScoreProvider } from "@/contexts/LoveScoreContext";
import { MasterAiProvider } from "@/contexts/MasterAiContext";
import { NewsProvider } from "@/contexts/NewsContext";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { PulseProvider } from "@/hooks/useIzmirPulse";
import "@/lib/apiClient";
import { AuthProvider, useAuth } from "@/lib/auth";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

import { useQueryClient } from "@tanstack/react-query";

function RootLayoutNav() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const prevUser = React.useRef(user?.id);

  useEffect(() => {
    if (prevUser.current !== user?.id) {
      queryClient.clear();
      prevUser.current = user?.id;
    }
  }, [user?.id, queryClient]);

  const subjectKey = user?.id ?? "anonymous";

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack key={subjectKey} screenOptions={{ headerBackTitle: "Geri" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="blog" options={{ headerShown: false }} />
        <Stack.Screen name="blog/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="instagram" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="partner" options={{ headerShown: false }} />
        <Stack.Screen name="transactions" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <LanguageProvider>
              <AuthProvider>
                <ProfileProvider>
                  <LoveScoreProvider>
                    <PulseProvider>
                      <AiBrainProvider>
                        <NewsProvider>
                          <ListingsProvider>
                            <BlogProvider>
                              <PreferencesProvider>
                                <MasterAiProvider>
                                  <GestureHandlerRootView style={{ flex: 1 }}>
                                    <KeyboardProvider>
                                      <RootLayoutNav />
                                      <MasterAiFab />
                                      <MasterAiSheet />
                                    </KeyboardProvider>
                                  </GestureHandlerRootView>
                                </MasterAiProvider>
                              </PreferencesProvider>
                            </BlogProvider>
                          </ListingsProvider>
                        </NewsProvider>
                      </AiBrainProvider>
                    </PulseProvider>
                  </LoveScoreProvider>
                </ProfileProvider>
              </AuthProvider>
            </LanguageProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
