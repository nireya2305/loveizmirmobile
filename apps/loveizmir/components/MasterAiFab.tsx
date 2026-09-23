import * as Haptics from "expo-haptics";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeartLogo } from "@/components/HeartLogo";
import { useColors } from "@/hooks/useColors";
import { useIzmirPulse } from "@/hooks/useIzmirPulse";

import { useMasterAi } from "@/contexts/MasterAiContext";

const USE_NATIVE_DRIVER = Platform.OS !== "web";

export function MasterAiFab() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useMasterAi();
  const { msToSunset } = useIzmirPulse();
  const [reduceMotion, setReduceMotion] = useState(false);

  // Glow intensifies in the golden hour (~75 min before → 25 min after sunset).
  const isSunset =
    msToSunset !== null &&
    msToSunset <= 75 * 60 * 1000 &&
    msToSunset >= -25 * 60 * 1000;

  const breath = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const hidden =
    !!pathname?.startsWith("/chat") ||
    !!pathname?.startsWith("/master-ai-widget");

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (hidden || reduceMotion) {
      breath.setValue(0);
      glow.setValue(0);
      return;
    }
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    const pulsing = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    breathing.start();
    pulsing.start();
    return () => {
      breathing.stop();
      pulsing.stop();
    };
  }, [breath, glow, hidden, reduceMotion]);

  if (hidden) return null;

  const tabsPaths = ["/", "/guide", "/news", "/life"];
  const isTab = tabsPaths.some(
    (p) => pathname === p || pathname?.startsWith(p + "?"),
  );
  const bottom =
    (Platform.OS === "web" ? 100 : (insets.bottom || 0) + 80) +
    (isTab ? 0 : -60);

  const scale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.045],
  });
  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: isSunset ? [0.35, 0.85] : [0.15, 0.5],
  });
  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, isSunset ? 1.7 : 1.45],
  });
  const glowColor = isSunset ? colors.sunset : colors.accent;

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, { zIndex: 50 }]}
    >
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.anchor,
          { right: 18, bottom: Math.max(bottom, 24), transform: [{ scale }] },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              backgroundColor: glowColor,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Loveİzmir AI’a sor"
          accessibilityHint="AI’a Sor"
          onPress={() => {
            if (Platform.OS !== "web") {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            open();
          }}
          style={({ pressed }) => [
            styles.fab,
            {
              backgroundColor: colors.accent,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
        >
          <HeartLogo size={22} />
          <Text style={styles.label}>Loveİzmir AI</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  label: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
