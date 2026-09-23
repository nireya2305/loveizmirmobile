import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { apiFetch } from "@/lib/apiClient";

type LiveSponsored = {
  id?: string;
  headline: string;
  body?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  imageUrl?: string | null;
  businessName?: string | null;
};

function asSponsored(value: unknown): LiveSponsored | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item.headline !== "string" || !item.headline.trim()) return null;

  return {
    id: typeof item.id === "string" ? item.id : undefined,
    headline: item.headline.trim(),
    body: typeof item.body === "string" ? item.body.trim() || null : null,
    ctaLabel:
      typeof item.ctaLabel === "string" ? item.ctaLabel.trim() || null : null,
    ctaUrl: typeof item.ctaUrl === "string" ? item.ctaUrl.trim() || null : null,
    imageUrl:
      typeof item.imageUrl === "string" ? item.imageUrl.trim() || null : null,
    businessName:
      typeof item.businessName === "string"
        ? item.businessName.trim() || null
        : null,
  };
}

export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !url.hostname
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Low-density native commercial placement for the Discover feed only.
 * It deliberately has no loading or error UI, so an unavailable campaign
 * leaves the feed unchanged.
 */
export function SponsoredPlacement({ placementKey }: { placementKey: string }) {
  const colors = useColors();
  const [sponsored, setSponsored] = useState<LiveSponsored | null>(null);

  useEffect(() => {
    let active = true;

    void apiFetch(
      `/api/commercial/live?placementKey=${encodeURIComponent(placementKey)}`,
    )
      .then(async (response) => {
        if (!response.ok) throw new Error(`Commercial API error ${response.status}`);
        const payload: unknown = await response.json();
        if (!payload || typeof payload !== "object") return null;
        const responseBody = payload as Record<string, unknown>;
        const candidates = Array.isArray(responseBody.items)
          ? responseBody.items
          : [responseBody.item ?? responseBody.campaign ?? responseBody.ad];
        return asSponsored(candidates[0]);
      })
      .then((item) => {
        if (active) setSponsored(item);
      })
      .catch(() => {
        if (active) setSponsored(null);
      });

    return () => {
      active = false;
    };
  }, [placementKey]);

  if (!sponsored) return null;

  const ctaUrl = safeExternalUrl(sponsored.ctaUrl);
  const imageUrl = safeExternalUrl(sponsored.imageUrl);
  const ctaLabel = sponsored.ctaLabel || "Keşfet";

  const openCta = async () => {
    if (!ctaUrl) return;
    try {
      const supported = await Linking.canOpenURL(ctaUrl);
      if (supported) await Linking.openURL(ctaUrl);
    } catch {
      // Outbound navigation failures should not interrupt the feed.
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      testID={`card-sponsored-${sponsored.id ?? placementKey}`}
      accessibilityLabel={`Sponsorlu içerik: ${sponsored.headline}`}
    >
      <View style={styles.topline}>
        <View style={[styles.label, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.labelText, { color: colors.accent }]}>
            SPONSORED / İŞ BİRLİĞİ
          </Text>
        </View>
        <Feather name="info" size={14} color={colors.mutedForeground} />
      </View>

      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          accessibilityLabel=""
        />
      ) : null}

      <View style={styles.content}>
        <Text style={[styles.headline, { color: colors.foreground }]} numberOfLines={2}>
          {sponsored.headline}
        </Text>
        {sponsored.body ? (
          <Text
            style={[styles.body, { color: colors.mutedForeground }]}
            numberOfLines={2}
          >
            {sponsored.body}
          </Text>
        ) : null}
        {sponsored.businessName ? (
          <Text style={[styles.business, { color: colors.aegeanDeep }]} numberOfLines={1}>
            {sponsored.businessName}
          </Text>
        ) : null}
      </View>

      {ctaUrl ? (
        <Pressable
          onPress={openCta}
          style={[styles.cta, { backgroundColor: colors.aegeanDeep }]}
          accessibilityRole="link"
          accessibilityLabel={`${ctaLabel}: ${sponsored.headline}`}
          testID={`link-sponsored-${sponsored.id ?? placementKey}`}
        >
          <Text style={[styles.ctaText, { color: colors.primaryForeground }]}>
            {ctaLabel}
          </Text>
          <Feather name="arrow-up-right" size={15} color={colors.primaryForeground} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 22,
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  topline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 13,
  },
  label: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  labelText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1,
  },
  image: {
    width: "100%",
    height: 150,
    marginTop: 12,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 13,
    gap: 5,
  },
  headline: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
    lineHeight: 23,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  business: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    marginTop: 2,
  },
  cta: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    margin: 14,
    marginTop: 12,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
});