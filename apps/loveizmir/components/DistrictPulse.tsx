import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useLoveScore } from "@/contexts/LoveScoreContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useColors } from "@/hooks/useColors";
import { DISTRICTS, type District } from "@/lib/izmirKnowledge";

const SCORE_KEYS: { key: keyof District["scores"]; label: string }[] = [
  { key: "gastro", label: "Gastro" },
  { key: "romance", label: "Romantik" },
  { key: "luxury", label: "Lüks" },
  { key: "calm", label: "Sakin" },
];

export function DistrictPulse() {
  const colors = useColors();
  const { award } = useLoveScore();
  const { trackDistrict } = usePreferences();

  const onTap = (district: District) => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    award("card_tap");
    trackDistrict(district.key);
    router.push({
      pathname: "/district/[key]",
      params: { key: district.key },
    });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: colors.accent }]}>
          BÖLGE NABZI · DISTRICT PULSE
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Her ilçenin kendi kişiliği var
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        decelerationRate="fast"
        snapToInterval={236}
      >
        {DISTRICTS.map((d) => (
          <Pressable
            key={d.key}
            onPress={() => onTap(d)}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            accessibilityRole="button"
            accessibilityLabel={d.name}
          >
            <View style={styles.banner}>
              <LinearGradient
                colors={d.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.bannerBody}>
                <Text style={styles.bannerName}>{d.name}</Text>
                <Text style={styles.bannerTag} numberOfLines={1}>
                  {d.tagline}
                </Text>
              </View>
            </View>

            <View style={styles.bars}>
              {SCORE_KEYS.map((sk) => {
                const v = d.scores[sk.key];
                return (
                  <View key={sk.key} style={styles.barRow}>
                    <Text
                      style={[
                        styles.barLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {sk.label}
                    </Text>
                    <View
                      style={[
                        styles.barTrack,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${v}%`,
                            backgroundColor: colors.aegeanDeep,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[styles.barScore, { color: colors.foreground }]}
                    >
                      {v}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.tagsRow}>
              {d.highlights.slice(0, 3).map((h) => (
                <View
                  key={h}
                  style={[
                    styles.tag,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.foreground }]}>
                    {h}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 28, gap: 12 },
  header: { paddingHorizontal: 20, gap: 4 },
  kicker: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.4,
  },
  title: { fontFamily: "Poppins_700Bold", fontSize: 18 },
  row: { paddingHorizontal: 20, gap: 12 },
  card: {
    width: 224,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  banner: { height: 84, overflow: "hidden" },
  bannerBody: {
    flex: 1,
    padding: 14,
    justifyContent: "flex-end",
  },
  bannerName: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
  bannerTag: {
    color: "rgba(255,255,255,0.92)",
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    marginTop: 2,
  },
  bars: { padding: 12, gap: 6 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  barLabel: {
    width: 56,
    fontFamily: "Inter_500Medium",
    fontSize: 10,
  },
  barTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 3 },
  barScore: {
    width: 24,
    textAlign: "right",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: { fontFamily: "Inter_500Medium", fontSize: 10 },
});
