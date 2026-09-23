import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { getApiBase } from "@/lib/apiClient";

type Marker = {
  id: string;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  type: "landmark" | "district" | "transport";
};

export function InteractiveMap({ height = 480 }: { height?: number }) {
  const colors = useColors();
  const router = useRouter();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/maps/markers`);
        const data = await res.json();
        if (!cancelled) setMarkers(data.markers || []);
      } catch {
        if (!cancelled) setMarkers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const staticMapUrl = `${getApiBase()}/api/maps/static?lat=38.42&lng=27.15&zoom=8.5&width=720&height=420`;

  const askAi = (title: string) => {
    // legacy disabled, use FAB
  };

  const pinColor = (t: Marker["type"]) =>
    t === "district"
      ? colors.aegeanDeep
      : t === "transport"
        ? "#f5a623"
        : colors.coral;

  return (
    <View
      style={[
        styles.wrap,
        {
          minHeight: height,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.mapBox, { backgroundColor: colors.aegeanDeep }]}>
        <Image
          source={{ uri: staticMapUrl }}
          style={styles.mapImg}
          resizeMode="cover"
        />
      </View>
      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: colors.text }]}>
          Noktalar
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginVertical: 24 }} color={colors.coral} />
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          {markers.map((m) => (
            <View
              key={m.id}
              style={[
                styles.row,
                {
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View
                style={[styles.dot, { backgroundColor: pinColor(m.type) }]}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  {m.title}
                </Text>
                <Text style={[styles.rowSub, { color: colors.muted }]}>
                  {m.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  mapBox: { height: 220, width: "100%" },
  mapImg: { width: "100%", height: "100%" },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  listTitle: { fontSize: 16, fontWeight: "700" },
  listHint: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6 },
  list: { maxHeight: 320 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  rowTitle: { fontSize: 14, fontWeight: "600" },
  rowSub: { fontSize: 12, marginTop: 2 },
  ask: { fontSize: 12, fontWeight: "600" },
});
