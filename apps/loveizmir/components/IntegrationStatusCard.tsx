import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useListIntegrations,
  type IntegrationItem,
  type IntegrationList,
  type IntegrationProviderState,
} from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const CACHE_KEY = "loveizmir.integration-os.status.v7";
const FEATURED = new Set([
  "authentication",
  "maps",
  "weather",
  "ai",
  "payments",
  "business",
]);

const STATE_LABELS: Record<IntegrationProviderState, string> = {
  ACTIVE: "Aktif",
  DEGRADED: "Kısıtlı",
  NOT_CONFIGURED: "Yapılandırılmadı",
  BLOCKED_EXTERNAL: "Dış servis engeli",
  DEFERRED: "Ertelendi",
};

export function IntegrationStatusCard() {
  const colors = useColors();
  const query = useListIntegrations({ limit: 50 });
  const [cached, setCached] = useState<IntegrationList | null>(null);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(CACHE_KEY)
      .then((value) => {
        if (active && value) setCached(JSON.parse(value) as IntegrationList);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!query.data) return;
    setCached(query.data);
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(query.data)).catch(
      () => undefined,
    );
  }, [query.data]);

  const data = query.data ?? cached;
  const isOfflineCache = !query.data && Boolean(cached);
  const featured = useMemo(
    () => data?.items.filter((item) => FEATURED.has(item.id)) ?? [],
    [data],
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      accessibilityLabel="Integration OS status"
    >
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: colors.secondary }]}>
          <Feather name="activity" size={18} color={colors.accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Integration OS
          </Text>
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>
            {isOfflineCache
              ? "Çevrimdışı önbellek · bilgi güncel olmayabilir"
              : data
                ? `${data.summary.total} grup · sunucu doğruluk kaynağı`
                : "Sağlayıcı durumu yükleniyor"}
          </Text>
        </View>
        <Pressable
          onPress={() => void query.refetch()}
          disabled={query.isFetching}
          style={[styles.refresh, { backgroundColor: colors.secondary }]}
          accessibilityRole="button"
          accessibilityLabel="Entegrasyon durumunu yenile"
        >
          <Feather name="refresh-cw" size={15} color={colors.accent} />
        </Pressable>
      </View>

      {data ? (
        <>
          <View style={styles.summary}>
            <Summary
              label="Aktif"
              value={data.summary.active}
              color={colors.accent}
            />
            <Summary
              label="Kısıtlı"
              value={data.summary.degraded}
              color={colors.olive}
            />
            <Summary
              label="Engelli"
              value={data.summary.blocked_external}
              color={colors.coral}
            />
          </View>
          <View style={styles.rows}>
            {featured.map((item) => (
              <StatusRow key={item.id} item={item} colors={colors} />
            ))}
          </View>
          <Text style={[styles.disclosure, { color: colors.mutedForeground }]}>
            Anahtar varlığı bağlantı sayılmaz. Canlı doğrulama yalnızca
            LIVE_PROBE olarak gösterilir; bu ekranda bağlama veya etkinleştirme
            işlemi yoktur.
          </Text>
        </>
      ) : query.isError ? (
        <Text style={[styles.error, { color: colors.coral }]}>
          Durum alınamadı ve kullanılabilir çevrimdışı kayıt yok.
        </Text>
      ) : null}
    </View>
  );
}

type Colors = ReturnType<typeof useColors>;

function StatusRow({
  item,
  colors,
}: {
  item: IntegrationItem;
  colors: Colors;
}) {
  const tone =
    item.status === "ACTIVE"
      ? colors.accent
      : item.status === "DEGRADED"
        ? colors.olive
        : item.status === "BLOCKED_EXTERNAL"
          ? colors.coral
          : colors.mutedForeground;
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <View style={[styles.dot, { backgroundColor: tone }]} />
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>
        {item.label}
      </Text>
      <Text style={[styles.rowState, { color: tone }]}>
        {STATE_LABELS[item.status]}
      </Text>
    </View>
  );
}

function Summary({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  hint: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  refresh: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: { flexDirection: "row", gap: 8 },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontFamily: "Poppins_700Bold", fontSize: 18 },
  summaryLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    textTransform: "uppercase",
  },
  rows: { gap: 6 },
  row: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  rowLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 13 },
  rowState: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  disclosure: { fontFamily: "Inter_400Regular", fontSize: 11, lineHeight: 16 },
  error: { fontFamily: "Inter_500Medium", fontSize: 12 },
});
