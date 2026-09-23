import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { HeartLogo } from "@/components/HeartLogo";
import { useLoveScore } from "@/contexts/LoveScoreContext";
import { useIzmirPulse } from "@/hooks/useIzmirPulse";
import { useColors } from "@/hooks/useColors";
import {
  getDailyCardsForBias,
  getMomentMeta,
  type LoopCard,
} from "@/lib/dailyLoop";

export function DailyLoop() {
  const colors = useColors();
  const router = useRouter();
  const { now, mood } = useIzmirPulse();
  const { award } = useLoveScore();

  const moment = useMemo(() => getMomentMeta(), [now]);
  const cards = useMemo(
    () => getDailyCardsForBias(now, mood.categoryBias, 5),
    [now, mood.categoryBias],
  );

  // legacy askAi removed

  return (
    <View style={styles.wrap}>
      <View
        style={[styles.hero, { backgroundColor: colors.aegeanDeep }]}
        accessibilityRole="button"
        accessibilityLabel={moment.title}
      >
        <LinearGradient
          colors={["rgba(255,107,107,0.0)", "rgba(255,107,107,0.35)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroBody}>
          <View style={styles.heroTopRow}>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.livePillText}>CANLI · ŞU AN İZMİR'DE</Text>
            </View>
            <Text style={styles.heroEmoji}>{moment.emoji}</Text>
          </View>
          <Text style={styles.heroKicker}>{moment.kicker}</Text>
          <Text style={styles.heroTitle}>{moment.title}</Text>
          <Text style={styles.heroSub}>{moment.body}</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        {cards.map((c) => (
          <DailyCard key={c.id} card={c} onPress={() => {}} />
        ))}
      </View>
    </View>
  );
}

function DailyCard({
  card,
  onPress,
}: {
  card: LoopCard;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      accessibilityRole="button"
      accessibilityLabel={card.title}
    >
      <View style={styles.cardHead}>
        <Text style={styles.cardEmoji}>{card.emoji}</Text>
        <Text style={[styles.cardCat, { color: colors.accent }]}>
          {categoryLabel(card.category)}
        </Text>
      </View>
      <Text
        style={[styles.cardTitle, { color: colors.foreground }]}
        numberOfLines={2}
      >
        {card.title}
      </Text>
      <Text
        style={[styles.cardBody, { color: colors.mutedForeground }]}
        numberOfLines={3}
      >
        {card.body}
      </Text>
    </View>
  );
}

function categoryLabel(cat: LoopCard["category"]): string {
  switch (cat) {
    case "gastro":
      return "GASTRO KEŞFİ";
    case "sunset":
      return "GÜN BATIMI";
    case "evening":
      return "BU AKŞAM";
    case "weekend":
      return "HAFTA SONU";
    case "cesme":
      return "ÇEŞME CANLI";
    case "urla":
      return "URLA SAKİN";
    case "quote":
      return "İZMİR SÖZÜ";
    case "ai":
      return "ÖZEL SEÇKİ";
  }
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, marginTop: 18, gap: 12 },

  hero: {
    borderRadius: 22,
    overflow: "hidden",
    padding: 20,
    minHeight: 180,
  },
  heroBody: { gap: 8 },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ff6b6b",
  },
  livePillText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.2,
  },
  heroEmoji: { fontSize: 30 },
  heroKicker: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  heroTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    lineHeight: 28,
  },
  heroSub: {
    color: "rgba(255,255,255,0.88)",
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  heroCta: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  heroCtaText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 },

  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48.4%",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    minHeight: 138,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardEmoji: { fontSize: 22 },
  cardCat: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    lineHeight: 18,
  },
  cardBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 15,
  },
  cardFoot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  cardFootText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
});
