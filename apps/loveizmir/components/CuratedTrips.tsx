import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { HeartLogo } from "@/components/HeartLogo";
import { useColors } from "@/hooks/useColors";
import {
  CURATED_CATEGORIES,
  type CuratedCategory,
  type CuratedTrip,
} from "@/lib/curatedTrips";

export function CuratedTrips() {
  const colors = useColors();
  const router = useRouter();
  const [activeCat, setActiveCat] = useState<CuratedCategory["id"]>("gurme");
  const [openTrip, setOpenTrip] = useState<string | null>(null);

  const accent = (a: CuratedCategory["accent"]): string => {
    switch (a) {
      case "coral":
        return colors.coral;
      case "aegean":
        return colors.aegean;
      case "olive":
        return colors.olive;
      case "amber":
        return "#f5a623";
    }
  };

  const active = CURATED_CATEGORIES.find((c) => c.id === activeCat)!;
  const tint = accent(active.accent);

  return (
    <View style={{ gap: 14 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
      >
        {CURATED_CATEGORIES.map((c) => {
          const isActive = c.id === activeCat;
          const t = accent(c.accent);
          return (
            <Pressable
              key={c.id}
              onPress={() => {
                setActiveCat(c.id);
                setOpenTrip(null);
              }}
              style={[
                styles.catChip,
                {
                  backgroundColor: isActive ? t : colors.card,
                  borderColor: isActive ? t : colors.border,
                },
              ]}
            >
              <Feather
                name={c.icon}
                size={14}
                color={isActive ? "#fff" : t}
              />
              <Text
                style={[
                  styles.catLabel,
                  { color: isActive ? "#fff" : colors.foreground },
                ]}
              >
                {c.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.catHeader, { borderColor: colors.border }]}>
        <View
          style={[styles.catBubble, { backgroundColor: tint + "22" }]}
        >
          <Feather name={active.icon} size={18} color={tint} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.catTitle, { color: colors.foreground }]}>
            {active.title}
          </Text>
          <Text
            style={[styles.catSubtitle, { color: colors.mutedForeground }]}
          >
            {active.subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {active.trips.map((trip: CuratedTrip) => {
          const isOpen = openTrip === trip.id;
          return (
            <View
              key={trip.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Pressable
                onPress={() => setOpenTrip(isOpen ? null : trip.id)}
                style={styles.cardHead}
              >
                <Text style={styles.emojiBig}>{trip.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                    {trip.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardEn,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {trip.titleEn}
                  </Text>
                  <View style={styles.metaRow}>
                    <View
                      style={[
                        styles.metaChip,
                        { backgroundColor: tint + "1a" },
                      ]}
                    >
                      <Feather name="clock" size={10} color={tint} />
                      <Text style={[styles.metaText, { color: tint }]}>
                        {trip.duration}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.metaChip,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Feather
                        name="trending-up"
                        size={10}
                        color={colors.accent}
                      />
                      <Text style={[styles.metaText, { color: colors.accent }]}>
                        {trip.difficulty}
                      </Text>
                    </View>
                    {trip.budgetTl ? (
                      <View
                        style={[
                          styles.metaChip,
                          { backgroundColor: colors.secondary },
                        ]}
                      >
                        <Text
                          style={[
                            styles.metaText,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {trip.budgetTl}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <Feather
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.mutedForeground}
                />
              </Pressable>

              <Text style={[styles.summary, { color: colors.foreground }]}>
                {trip.summary}
              </Text>

              {isOpen && (
                <View style={styles.details}>
                  <View style={styles.bestTimeRow}>
                    <Feather name="sun" size={12} color={tint} />
                    <Text style={[styles.bestTime, { color: tint }]}>
                      En iyi zaman: {trip.bestTime}
                    </Text>
                  </View>

                  <Text style={[styles.label, { color: colors.foreground }]}>
                    Rota
                  </Text>
                  <View style={styles.stops}>
                    {trip.stops.map((s, i) => (
                      <View key={s.title} style={styles.stopRow}>
                        <View
                          style={[styles.stopDot, { backgroundColor: tint }]}
                        >
                          <Text style={styles.stopNum}>{i + 1}</Text>
                        </View>
                        <View style={{ flex: 1, gap: 2 }}>
                          <View style={styles.stopHead}>
                            <Text
                              style={[
                                styles.stopTitle,
                                { color: colors.foreground },
                              ]}
                            >
                              {s.title}
                            </Text>
                            {s.duration ? (
                              <Text
                                style={[
                                  styles.stopDur,
                                  { color: colors.mutedForeground },
                                ]}
                              >
                                {s.duration}
                              </Text>
                            ) : null}
                          </View>
                          <Text
                            style={[
                              styles.stopDetail,
                              { color: colors.mutedForeground },
                            ]}
                          >
                            {s.detail}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <Text style={[styles.label, { color: colors.foreground }]}>
                    İpuçları
                  </Text>
                  <View style={styles.tips}>
                    {trip.tips.map((tip) => (
                      <View key={tip} style={styles.tipRow}>
                        <Feather
                          name="check-circle"
                          size={13}
                          color={tint}
                        />
                        <Text
                          style={[
                            styles.tipText,
                            { color: colors.foreground },
                          ]}
                        >
                          {tip}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  catRow: { paddingHorizontal: 20, gap: 8 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  catLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  catHeader: {
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  catBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  catTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 15 },
  catSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  list: { paddingHorizontal: 20, gap: 12 },
  card: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emojiBig: { fontSize: 36 },
  cardTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  cardEn: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  metaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.3,
  },
  summary: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  details: { gap: 10 },
  bestTimeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  bestTime: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  label: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 6,
  },
  stops: { gap: 10 },
  stopRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  stopDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stopNum: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 11 },
  stopHead: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 6,
  },
  stopTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, flex: 1 },
  stopDur: { fontFamily: "Inter_500Medium", fontSize: 11 },
  stopDetail: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  tips: { gap: 6 },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  tipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  ctaText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    flex: 1,
  },
});
