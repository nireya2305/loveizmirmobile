import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { resolvePhotoUrl, type Place } from "@/hooks/usePlaces";
import { getApiBase } from "@/lib/apiClient";

import { Platform } from "react-native";

export function PlaceCard({ place }: { place: Place }) {
  const colors = useColors();
  const router = useRouter();
  const photo = resolvePhotoUrl(place.photoUrl);

  const lat = place.location?.lat;
  const lng = place.location?.lng;
  const hasCoords =
    typeof lat === "number" && typeof lng === "number";
  const mapPreviewUrl = hasCoords
    ? `${getApiBase()}/api/maps/static?lat=${lat}&lng=${lng}&zoom=14&width=600&height=240`
    : null;

  const openDirections = async () => {
    if (!hasCoords) {
      if (place.mapsUrl) void open(place.mapsUrl);
      return;
    }
    const label = encodeURIComponent(place.title || "İzmir");
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    void Linking.openURL(url).catch(() => {
      if (place.mapsUrl) void open(place.mapsUrl);
    });
  };

  const open = async (url: string | null) => {
    if (!url) return;
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      void Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} contentFit="cover" />
      ) : mapPreviewUrl ? (
        <Pressable onPress={openDirections} accessibilityRole="button">
          <Image
            source={{ uri: mapPreviewUrl }}
            style={styles.photo}
            contentFit="cover"
          />
        </Pressable>
      ) : (
        <View style={[styles.photo, { backgroundColor: colors.secondary }]}>
          <Feather name="image" size={28} color={colors.mutedForeground} />
        </View>
      )}

      {photo && mapPreviewUrl && (
        <Pressable
          onPress={openDirections}
          accessibilityRole="button"
          accessibilityLabel="Yol tarifi"
        >
          <Image
            source={{ uri: mapPreviewUrl }}
            style={styles.mapPreview}
            contentFit="cover"
          />
          <View style={[styles.mapBadge, { backgroundColor: colors.accent }]}>
            <Feather name="navigation" size={11} color="#fff" />
            <Text style={styles.mapBadgeText}>Yol tarifi al</Text>
          </View>
        </Pressable>
      )}

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
            {place.title}
          </Text>
          {place.rating !== null && (
            <View style={[styles.ratePill, { backgroundColor: colors.aegeanDeep }]}>
              <Feather name="star" size={11} color="#fff" />
              <Text style={styles.rateText}>
                {place.rating.toFixed(1)}
                {place.ratingCount ? ` · ${place.ratingCount}` : ""}
              </Text>
            </View>
          )}
        </View>

        {place.type && (
          <Text style={[styles.type, { color: colors.aegean }]}>{place.type}</Text>
        )}
        {place.address && (
          <View style={styles.metaRow}>
            <Feather name="map-pin" size={12} color={colors.mutedForeground} />
            <Text
              style={[styles.metaText, { color: colors.mutedForeground }]}
              numberOfLines={2}
            >
              {place.address}
            </Text>
          </View>
        )}
        {place.phone && (
          <View style={styles.metaRow}>
            <Feather name="phone" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {place.phone}
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          {place.websiteUrl && (
            <Pressable
              onPress={() => open(place.websiteUrl)}
              accessibilityRole="button"
              style={[styles.actionBtn, { backgroundColor: colors.accent }]}
            >
              <Feather name="external-link" size={13} color="#fff" />
              <Text style={styles.actionText}>Web sitesi</Text>
            </Pressable>
          )}
          {place.mapsUrl && (
            <Pressable
              onPress={() => open(place.mapsUrl)}
              accessibilityRole="button"
              style={[
                styles.actionBtn,
                {
                  backgroundColor: colors.secondary,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="map" size={13} color={colors.accent} />
              <Text style={[styles.actionText, { color: colors.foreground }]}>
                Haritada aç
              </Text>
            </Pressable>
          )}
          {place.id && place.businessId && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/transactions/request",
                  params: { placeId: place.id, businessId: place.businessId },
                })
              }
              accessibilityRole="button"
              style={[
                styles.actionBtn,
                {
                  backgroundColor: colors.coral,
                  borderWidth: 1,
                  borderColor: colors.coral,
                },
              ]}
            >
              <Feather name="check-square" size={13} color="#fff" />
              <Text style={[styles.actionText, { color: "#fff" }]}>
                Talep Oluştur
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  photo: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPreview: {
    width: "100%",
    height: 120,
  },
  mapBadge: {
    position: "absolute",
    right: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  mapBadgeText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  body: { padding: 14, gap: 6 },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  ratePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  rateText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 11,
  },
  type: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  actionText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
});
