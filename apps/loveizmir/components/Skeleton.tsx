import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  type DimensionValue,
  type ViewStyle,
} from "react-native";

import { useColors } from "@/hooks/useColors";

const USE_NATIVE_DRIVER = Platform.OS !== "web";

type SkeletonProps = {
  width?: DimensionValue;
  height: number;
  radius?: number;
  style?: ViewStyle;
};

/** A single shimmering placeholder block. */
export function Skeleton({ width = "100%", height, radius = 12, style }: SkeletonProps) {
  const colors = useColors();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 850,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 850,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.muted, opacity },
        style,
      ]}
    />
  );
}

/** Skeleton matching the news card shape, for the "never blank" loading rule. */
export function NewsCardSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Skeleton height={150} radius={14} />
      <View style={{ gap: 8, marginTop: 12 }}>
        <Skeleton height={12} width="40%" />
        <Skeleton height={18} width="92%" />
        <Skeleton height={14} width="60%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
});
