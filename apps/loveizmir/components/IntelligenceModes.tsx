import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { INTELLIGENCE_MODES } from "@/lib/izmirKnowledge";

export function IntelligenceModes() {
  const colors = useColors();

  const onTap = (modeKey: string) => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // legacy removed
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: colors.accent }]}>
          ULTRA DEEP · INTELLIGENCE MODES
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          İzmir'i yerelden{"\n"}daha iyi bilen AI
        </Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Bir mod seç — Loveİzmir AI o alanda kıdemli rehber gibi konuşur.
        </Text>
      </View>

      <View style={styles.grid}>
        {INTELLIGENCE_MODES.map((m) => (
          <Pressable
            key={m.key}
            onPress={() => onTap(m.key)}
            style={styles.tile}
            accessibilityRole="button"
            accessibilityLabel={m.label}
          >
            <LinearGradient
              colors={m.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.tileBody}>
              <Text style={styles.tileEmoji}>{m.emoji}</Text>
              <Text style={styles.tileLabel} numberOfLines={2}>
                {m.label}
              </Text>
              <View style={styles.tileChip}>
                <Text style={styles.tileChipText}>{m.short.toUpperCase()}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, marginTop: 28, gap: 14 },
  header: { gap: 4 },
  kicker: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    lineHeight: 26,
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    width: "48%",
    aspectRatio: 1.4,
    borderRadius: 18,
    overflow: "hidden",
  },
  tileBody: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  tileEmoji: { fontSize: 22 },
  tileLabel: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    lineHeight: 18,
  },
  tileChip: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  tileChipText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1,
  },
});
