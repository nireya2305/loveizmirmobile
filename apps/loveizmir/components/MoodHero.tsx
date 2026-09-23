import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useIzmirPulse } from "@/hooks/useIzmirPulse";
import { useColors } from "@/hooks/useColors";
import { CANONICAL_SLOGAN, LIVING_CITY_COPY } from "@/lib/brand";
import { weatherEmoji, weatherLabel } from "@/lib/weather";

export function MoodHero() {
  const { mood, weather } = useIzmirPulse();

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <LinearGradient
          colors={mood.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroBody}>
          <View style={styles.topRow}>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.livePillText}>
                İZMİR ŞU AN · {mood.energy.toUpperCase()}
              </Text>
            </View>
            {weather && (
              <View style={styles.weatherChip}>
                <Text style={styles.weatherEmoji}>
                  {weatherEmoji(weather.weatherCode, weather.isDay)}
                </Text>
                <Text style={styles.weatherText}>
                  {Math.round(weather.temperatureC)}° ·{" "}
                  {weatherLabel(weather.weatherCode)}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.bigEmoji}>{mood.emoji}</Text>
          <Text style={styles.greeting}>{mood.greeting}</Text>
          <Text style={styles.slogan}>{CANONICAL_SLOGAN}</Text>
          <Text style={styles.oneLiner}>{LIVING_CITY_COPY}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, gap: 12 },
  hero: {
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 240,
  },
  heroBody: { padding: 22, gap: 6 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.22)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  livePillText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.2,
  },
  weatherChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  weatherEmoji: { fontSize: 13 },
  weatherText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  bigEmoji: { fontSize: 30, marginTop: 8 },
  greeting: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    lineHeight: 28,
    marginTop: 2,
  },
  oneLiner: {
    color: "rgba(255,255,255,0.92)",
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  slogan: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    marginTop: 2,
  },
});
