import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useLoveScore } from "@/contexts/LoveScoreContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useColors } from "@/hooks/useColors";
import { evaluateBadges, type Badge } from "@/lib/passport";

export function PassportGrid() {
  const colors = useColors();
  const { score, daysWithAction } = useLoveScore();
  const { state: prefs } = usePreferences();
  const { visited, memories } = useProfile();

  const chatDays = daysWithAction("chat_used");
  const sunsetDays = daysWithAction("sunset_view");

  const result = useMemo(() => {
    return evaluateBadges({
      score,
      visitedCount: visited.length,
      memoriesCount: memories.length,
      districts: prefs.districts,
      modes: prefs.modes,
      chatCount: chatDays,
      sunsetViewCount: sunsetDays,
    });
  }, [score, prefs, visited.length, memories.length, chatDays, sunsetDays]);

  const pct = Math.round((result.unlockedCount / result.total) * 100);

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            🛂 Loveİzmir Pasaport
          </Text>
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>
            Şehri yaşadıkça rozetler açılır
          </Text>
        </View>
        <View
          style={[styles.countPill, { backgroundColor: colors.aegeanDeep }]}
        >
          <Text style={styles.countText}>
            {result.unlockedCount}/{result.total}
          </Text>
        </View>
      </View>

      <View style={[styles.barTrack, { backgroundColor: colors.secondary }]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${pct}%`,
              backgroundColor: colors.coral,
            },
          ]}
        />
      </View>

      <View style={styles.grid}>
        {result.unlocked.map((b) => (
          <BadgeTile key={b.id} badge={b} unlocked colors={colors} />
        ))}
        {result.locked.map((b) => (
          <BadgeTile key={b.id} badge={b} unlocked={false} colors={colors} />
        ))}
      </View>
    </View>
  );
}

function BadgeTile({
  badge,
  unlocked,
  colors,
}: {
  badge: Badge;
  unlocked: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: unlocked ? colors.background : colors.secondary,
          borderColor: unlocked ? colors.coral : colors.border,
          opacity: unlocked ? 1 : 0.55,
        },
      ]}
    >
      <Text style={[styles.tileEmoji, !unlocked && styles.tileEmojiLocked]}>
        {badge.emoji}
      </Text>
      <Text
        style={[styles.tileName, { color: colors.foreground }]}
        numberOfLines={1}
      >
        {badge.name}
      </Text>
      <Text
        style={[styles.tileHint, { color: colors.mutedForeground }]}
        numberOfLines={2}
      >
        {badge.hint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  hint: {
    fontSize: 12,
    marginTop: 2,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  barTrack: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tile: {
    width: "31%",
    minWidth: 96,
    flexGrow: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: "center",
    gap: 4,
  },
  tileEmoji: {
    fontSize: 26,
  },
  tileEmojiLocked: {
    opacity: 0.4,
  },
  tileName: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  tileHint: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 13,
  },
});
