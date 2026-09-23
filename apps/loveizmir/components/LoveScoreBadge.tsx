import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useLoveScore } from "@/contexts/LoveScoreContext";
import { useColors } from "@/hooks/useColors";

export function LoveScoreBadge() {
  const colors = useColors();
  const router = useRouter();
  const { score, level } = useLoveScore();

  return (
    <Pressable
      onPress={() => router.push("/profile")}
      accessibilityRole="button"
      accessibilityLabel={`Love Score ${score}, ${level.name}`}
      style={[
        styles.wrap,
        { backgroundColor: colors.secondary, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: colors.aegeanDeep },
        ]}
      >
        <Text style={styles.dotText}>{level.emoji}</Text>
      </View>
      <View>
        <Text style={[styles.score, { color: colors.foreground }]}>
          {score}
        </Text>
        <Text style={[styles.level, { color: colors.mutedForeground }]}>
          {level.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: { fontSize: 13 },
  score: { fontFamily: "Poppins_700Bold", fontSize: 13, lineHeight: 14 },
  level: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 1,
  },
});
