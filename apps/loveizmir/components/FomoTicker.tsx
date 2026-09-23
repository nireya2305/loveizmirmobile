import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useLoveScore } from "@/contexts/LoveScoreContext";
import { useColors } from "@/hooks/useColors";
import { useIzmirPulse } from "@/hooks/useIzmirPulse";
import { getFomoMoments, type FomoMoment } from "@/lib/fomo";

export function FomoTicker() {
  const colors = useColors();
  const { mood, now, msToSunset } = useIzmirPulse();
  const { award } = useLoveScore();

  const [moments, setMoments] = useState<FomoMoment[]>(() =>
    getFomoMoments({ mood, now, msToSunset }),
  );

  useEffect(() => {
    setMoments(getFomoMoments({ mood, now, msToSunset }));
  }, [mood, now, msToSunset]);

  // Soft pulse on the live dot
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const dotOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });
  const dotScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.15],
  });

  const onTap = (m: FomoMoment) => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    award("card_tap");
  };

  if (moments.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.liveRow}>
          <Animated.View
            style={[
              styles.dot,
              { opacity: dotOpacity, transform: [{ scale: dotScale }] },
            ]}
          />
          <Text style={[styles.kicker, { color: colors.accent }]}>
            ŞU AN İZMİR'DE · LIVE
          </Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Bir şeyler oluyor
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        decelerationRate="fast"
        snapToInterval={252}
      >
        {moments.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => onTap(m)}
            style={styles.card}
            accessibilityRole="button"
            accessibilityLabel={`${m.district}: ${m.title}`}
          >
            <LinearGradient
              colors={m.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.cardEmoji}>{m.emoji}</Text>
                <View style={styles.cardChip}>
                  <Text style={styles.cardChipText}>
                    {m.district.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {m.title}
              </Text>
              <Text style={styles.cardDetail} numberOfLines={2}>
                {m.detail}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24, gap: 10 },
  header: { paddingHorizontal: 20, gap: 4 },
  liveRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff3b30",
  },
  kicker: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.4,
  },
  title: { fontFamily: "Poppins_700Bold", fontSize: 18 },
  row: { paddingHorizontal: 20, gap: 12 },
  card: {
    width: 240,
    minHeight: 140,
    borderRadius: 18,
    overflow: "hidden",
  },
  cardBody: { flex: 1, padding: 14, gap: 6 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardEmoji: { fontSize: 22 },
  cardChip: {
    backgroundColor: "rgba(0,0,0,0.28)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  cardChipText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1,
  },
  cardTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    lineHeight: 19,
    marginTop: 4,
  },
  cardDetail: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 15,
  },
});
