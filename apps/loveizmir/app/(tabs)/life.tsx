import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeartLogo } from "@/components/HeartLogo";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeader } from "@/components/SectionHeader";
import {
  useListings,
  type Listing,
  type ListingCat,
} from "@/contexts/ListingsContext";
import { PlaceCard } from "@/components/PlaceCard";
import { useAiSuggestions } from "@/hooks/useAiSuggestions";
import { usePlaces, type PlaceCategory } from "@/hooks/usePlaces";
import { apiFetch, getApiBase } from "@/lib/apiClient";
import { useAuth } from "@/lib/auth";
import { friendlyMessage } from "@/lib/friendlyError";
import { MEDICAL, PROPERTIES } from "@/lib/data";
import { LISTING_CATEGORIES, type ListingCategory } from "@/lib/services";
import { useColors } from "@/hooks/useColors";
import { useListMarketplaceProducts } from "@workspace/api-client-react";

type SegKey = "marketplace" | "boat" | "car" | "stay" | "medical" | "estate" | "list";

const MARKETPLACE_PRODUCT_TYPES = [
  "RESTAURANT", "HOTEL", "VILLA", "BOAT", "YACHT", "MARINA", "BEACH",
  "WINERY", "CAFE", "EVENT", "THEATRE", "CINEMA", "CONCERT", "EXPERIENCE",
  "REAL_ESTATE_PROJECT", "PROPERTY", "DEVELOPER_SERVICE", "HEALTH_SERVICE",
  "DENTAL", "HAIR_TRANSPLANT", "WELLNESS", "TRANSFER", "TOUR", "GUIDE",
  "SERVICE", "OTHER",
] as const;
type MarketplaceProductType = (typeof MARKETPLACE_PRODUCT_TYPES)[number];

type MarketplaceListProduct = {
  id: string;
  productType: MarketplaceProductType;
  titleTr?: string | null;
  titleEn?: string | null;
  primaryMediaId?: string | null;
  category?: string | null;
  descriptionTr?: string | null;
  priceMode?: string | null;
  amountMinor?: number | null;
  currency?: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

function isMarketplaceProductType(value: unknown): value is MarketplaceProductType {
  return typeof value === "string" &&
    MARKETPLACE_PRODUCT_TYPES.some((type) => type === value);
}

function isMarketplaceListProduct(value: unknown): value is MarketplaceListProduct {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    isMarketplaceProductType(value.productType) &&
    isOptionalString(value.titleTr) &&
    isOptionalString(value.titleEn) &&
    (typeof value.titleTr === "string" || typeof value.titleEn === "string") &&
    isOptionalString(value.primaryMediaId) &&
    isOptionalString(value.category) &&
    isOptionalString(value.descriptionTr) &&
    isOptionalString(value.priceMode) &&
    (value.amountMinor === undefined ||
      value.amountMinor === null ||
      typeof value.amountMinor === "number") &&
    isOptionalString(value.currency)
  );
}

function parseMarketplaceListEnvelope(value: unknown): MarketplaceListProduct[] | null {
  if (!isRecord(value) || !isRecord(value.data) || !Array.isArray(value.data.items)) {
    return null;
  }
  if (value.error !== null || !isRecord(value.meta)) return null;
  return value.data.items.every(isMarketplaceListProduct)
    ? value.data.items
    : null;
}

function marketplaceParams(productType: MarketplaceProductType): {
  productType: MarketplaceProductType;
} {
  return { productType };
}

function resolvePublicMediaUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${getApiBase()}${path.startsWith("/api/") ? path : `/api${path}`}`;
}

const SEGMENTS: {
  key: SegKey;
  label: string;
  en: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { key: "marketplace", label: "Pazar", en: "Market", icon: "shopping-bag" },
  { key: "boat", label: "Tekne", en: "Boat", icon: "anchor" },
  { key: "car", label: "Araç", en: "Car", icon: "truck" },
  { key: "stay", label: "Konaklama", en: "Stay", icon: "home" },
  { key: "medical", label: "Sağlık", en: "Medical", icon: "heart" },
  { key: "estate", label: "Emlak", en: "Estate", icon: "key" },
  { key: "list", label: "İlan Ver", en: "List", icon: "plus-circle" },
];

const SEG_KEYS: SegKey[] = ["marketplace", "boat", "car", "stay", "medical", "estate", "list"];

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ seg?: string }>();
  const initialSeg: SegKey = SEG_KEYS.includes(params.seg as SegKey)
    ? (params.seg as SegKey)
    : "marketplace";
  const [seg, setSeg] = useState<SegKey>(initialSeg);

  useEffect(() => {
    if (params.seg && SEG_KEYS.includes(params.seg as SegKey)) {
      setSeg(params.seg as SegKey);
    }
  }, [params.seg]);

  const bottomInset = Platform.OS === "web" ? 120 : (insets.bottom || 0) + 100;

  const askAi = (q: string) => {
    // legacy disabled, use FAB
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Hizmetler"
        titleEn="Book · Stay · Rent · List"
        subtitle="İzmir'de ihtiyacın olan her şey — ya da firma isen ilanını ekle."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.segRow}
      >
        {SEGMENTS.map((s) => {
          const active = seg === s.key;
          return (
            <Pressable
              key={s.key}
              onPress={() => setSeg(s.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${s.label} sekmesi`}
              style={[
                styles.segChip,
                {
                  backgroundColor: active ? colors.aegeanDeep : colors.card,
                  borderColor: active ? colors.aegeanDeep : colors.border,
                },
              ]}
            >
              <Feather
                name={s.icon}
                size={14}
                color={active ? "#fff" : colors.accent}
              />
              <Text
                style={[
                  styles.segLabel,
                  { color: active ? "#fff" : colors.foreground },
                ]}
              >
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomInset }}
        showsVerticalScrollIndicator={false}
      >
        {seg === "marketplace" && <MarketplaceSection colors={colors} />}
        {seg === "boat" && (
          <RentalSection cat="boat" colors={colors}  />
        )}
        {seg === "car" && (
          <RentalSection cat="car" colors={colors}  />
        )}
        {seg === "stay" && (
          <RentalSection cat="stay" colors={colors}  />
        )}
        {seg === "medical" && <MedicalSection colors={colors}  />}
        {seg === "estate" && <EstateSection colors={colors}  />}
        {seg === "list" && <ListingForm colors={colors} />}
      </ScrollView>
    </View>
  );
}

function MarketplaceSection({ colors }: { colors: ReturnType<typeof useColors> }) {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useListMarketplaceProducts();

  const parsedProducts =
    data === undefined ? undefined : parseMarketplaceListEnvelope(data);
  const products = parsedProducts ?? [];
  const malformed = data !== undefined && parsedProducts === null;

  return (
    <>
      <View style={styles.heroWrap}>
        <Image
          source={require("../../assets/images/izmir-kordon.png")}
          style={styles.heroImg}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(14,116,144,0.85)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroBody}>
          <Text style={styles.heroKicker}>Loveİzmir Market</Text>
          <Text style={styles.heroTitle}>Güvenli Pazar</Text>
          <Text style={styles.heroSub}>
            Tüm ilanlar doğrulanmış iş ortaklarından.
          </Text>
        </View>
      </View>

      <View style={styles.refreshRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.refreshKicker, { color: colors.accent }]}>
            Marketplace
          </Text>
          <Text style={[styles.refreshTitle, { color: colors.foreground }]}>
            Keşfet
          </Text>
          <Text style={[styles.refreshSub, { color: colors.mutedForeground }]}>
            Gerçek zamanlı müsaitlik ve şeffaf fiyatlar.
          </Text>
        </View>
        <Pressable
          onPress={() => refetch()}
          disabled={isLoading || isRefetching}
          accessibilityRole="button"
          accessibilityLabel="Yenile"
          style={[
            styles.refreshBtn,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          {isLoading || isRefetching ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Feather name="refresh-cw" size={16} color={colors.accent} />
          )}
        </Pressable>
      </View>

      {isLoading && products.length === 0 && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Ürünler yükleniyor…
          </Text>
        </View>
      )}

      {(isError || malformed) && products.length === 0 && (
        <View
          style={[
            styles.errorWrap,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <Feather name="alert-triangle" size={18} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            {malformed
              ? "Ürün verisi beklenen doğrulanmış biçimde değil."
              : "Bağlantı hatası oluştu. Lütfen tekrar deneyin."}
          </Text>
        </View>
      )}

      <View style={styles.col}>
        {products.map((p) => (
          <MarketplaceProductCard
            key={p.id}
            product={p}
            colors={colors}
            onPress={() => router.push(`/product/${p.id}` as never)}
          />
        ))}
      </View>

      {products.length === 0 && !isLoading && !isError && !malformed && (
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Şu an için listelenecek ürün bulunmuyor.
        </Text>
      )}
    </>
  );
}

function MarketplaceProductCard({
  product,
  colors,
  onPress,
}: {
  product: MarketplaceListProduct;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const mediaUrl = product.primaryMediaId
    ? resolvePublicMediaUrl(
        `/v1/products/${encodeURIComponent(product.id)}/media/${encodeURIComponent(product.primaryMediaId)}`,
      )
    : null;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, overflow: "hidden" },
      ]}
    >
      {mediaUrl ? (
        <Image
          source={{ uri: mediaUrl }}
          style={{ width: "100%", height: 160, backgroundColor: colors.secondary }}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.marketplaceMediaPlaceholder, { backgroundColor: colors.secondary }]}>
          <Feather name="image" size={28} color={colors.mutedForeground} />
        </View>
      )}
      <View style={{ padding: 16, gap: 8 }}>
        <View style={styles.titleRow}>
          <Text style={[styles.cardTitle, { color: colors.foreground, flex: 1 }]}>
            {product.titleTr || product.titleEn}
          </Text>
          <HeartLogo size={14} />
        </View>
        <View style={styles.locRow}>
          <Feather name="tag" size={12} color={colors.mutedForeground} />
          <Text style={[styles.locText, { color: colors.mutedForeground }]}>
            {product.productType}
            {product.category && ` · ${product.category}`}
          </Text>
        </View>
        {!!product.descriptionTr && (
          <Text style={[styles.body, { color: colors.mutedForeground }]} numberOfLines={3}>
            {product.descriptionTr}
          </Text>
        )}
        <View style={styles.priceRow}>
          {product.priceMode !== "REQUEST_ONLY" && (
            <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
              Fiyat ({product.priceMode})
            </Text>
          )}
          <Text style={[styles.price, { color: colors.aegeanDeep }]}>
            {product.amountMinor
              ? `${(product.amountMinor / 100).toFixed(2)} ${product.currency || 'TRY'}`
              : product.priceMode === "REQUEST_ONLY"
                ? "Soruşturun"
                : "Ücretsiz / Belirtilmemiş"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/* ---------------- Sections ---------------- */

const RENTAL_META: Record<
  ListingCat,
  {
    hero: number;
    overlay: string;
    kicker: string;
    title: string;
    sub: string;
    sectionKicker: string;
    sectionTitle: string;
    sectionSub: string;
  }
> = {
  boat: {
    hero: 0,
    overlay: "rgba(14,116,144,0.85)",
    kicker: "Boat Charter",
    title: "Tekne Kiralama",
    sub: "Çeşme, Foça, Urla · Kaynaklı ilanlar",
    sectionKicker: "Current Listings",
    sectionTitle: "Şu an kiralık tekneler",
    sectionSub:
      "Loveİzmir kaynaklarından alınan ilanlar; müsaitlik için ilan sayfasını doğrulayın.",
  },
  car: {
    hero: 1,
    overlay: "rgba(255,107,107,0.85)",
    kicker: "Car Rental",
    title: "Araç Kiralama",
    sub: "ADB havalimanı · Şehir teslim · Kaynaklı fiyatlar",
    sectionKicker: "Current Fleet",
    sectionTitle: "İzmir'de kiralanabilen araçlar",
    sectionSub:
      "Sağlayıcı kaynaklarından alınan fiyatlar; güncelliği ilan sayfasında doğrulayın.",
  },
  stay: {
    hero: 2,
    overlay: "rgba(8,145,178,0.85)",
    kicker: "Daily Stays",
    title: "Günlük Konaklama",
    sub: "Airbnb, Booking, lokal hostlar · Kaynaklı ilanlar",
    sectionKicker: "Current Stays",
    sectionTitle: "Günlük kiralık daire ve villalar",
    sectionSub:
      "Konaklama kaynaklarından alınan sonuçlar; müsaitliği ilan sayfasında doğrulayın.",
  },
};

const HERO_IMGS = [
  require("../../assets/images/yacht.png"),
  require("../../assets/images/car-rental.png"),
  require("../../assets/images/apartment.png"),
];

function RentalSection({
  cat,
  colors,

}: {
  cat: ListingCat;
  colors: ReturnType<typeof useColors>;

}) {
  const state = useListings(cat);
  const meta = RENTAL_META[cat];

  const openUrl = useCallback(async (url?: string) => {
    if (!url) return;
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      <View style={styles.heroWrap}>
        <Image
          source={HERO_IMGS[meta.hero]}
          style={styles.heroImg}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", meta.overlay]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroBody}>
          <Text style={styles.heroKicker}>{meta.kicker}</Text>
          <Text style={styles.heroTitle}>{meta.title}</Text>
          <Text style={styles.heroSub}>{meta.sub}</Text>
        </View>
      </View>

      <View style={styles.refreshRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.refreshKicker, { color: colors.accent }]}>
            {meta.sectionKicker}
          </Text>
          <Text style={[styles.refreshTitle, { color: colors.foreground }]}>
            {meta.sectionTitle}
          </Text>
          <Text style={[styles.refreshSub, { color: colors.mutedForeground }]}>
            {state.lastUpdated
              ? `Son güncelleme: ${new Date(state.lastUpdated).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`
              : meta.sectionSub}
          </Text>
        </View>
        <Pressable
          onPress={() => state.refresh()}
          disabled={state.loading}
          accessibilityRole="button"
          accessibilityLabel="Yenile"
          style={[
            styles.refreshBtn,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          {state.loading ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Feather name="refresh-cw" size={16} color={colors.accent} />
          )}
        </Pressable>
      </View>

      {state.loading && state.items.length === 0 && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loveİzmir kaynaklarından ilanlar yükleniyor…
          </Text>
        </View>
      )}

      {state.error && state.items.length === 0 && (
        <View
          style={[
            styles.errorWrap,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <Feather name="zap" size={18} color={colors.accent} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            {friendlyMessage(state.error)}
          </Text>
        </View>
      )}

      <View style={styles.col}>
        {state.items.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            colors={colors}
            onAsk={() => {}}
            onOpen={() => openUrl(l.url)}
          />
        ))}
      </View>

      {state.items.length === 0 && !state.loading && !state.error && (
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Henüz onaylı ilan yok. Aşağıdaki kaynaklı önerilere göz at.
        </Text>
      )}

      <PlacesBlock cat={cat} colors={colors} />

      <AiSuggestionsBlock
        cat={cat}
        colors={colors}

        onOpenUrl={openUrl}
      />
    </>
  );
}

function PlacesBlock({
  cat,
  colors,
}: {
  cat: ListingCat;
  colors: ReturnType<typeof useColors>;
}) {
  const placeCat: PlaceCategory =
    cat === "stay" ? "hotel" : cat === "boat" ? "boat" : "car";
  const places = usePlaces(placeCat);

  if (places.error && places.items.length === 0) {
    return (
      <View
        style={[
          styles.errorWrap,
          {
            backgroundColor: colors.secondary,
            borderColor: colors.border,
            marginTop: 18,
          },
        ]}
      >
        <Feather name="zap" size={18} color={colors.accent} />
        <Text style={[styles.errorText, { color: colors.foreground }]}>
          {friendlyMessage(places.error)}
        </Text>
      </View>
    );
  }

  if (places.loading && places.items.length === 0) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
          Google haritalarından yerler yükleniyor…
        </Text>
      </View>
    );
  }

  if (places.items.length === 0) return null;

  const kicker =
    placeCat === "hotel"
      ? "Google Places · Hotels"
      : placeCat === "boat"
        ? "Google Places · Marinas & Charter"
        : "Google Places · Rentals";
  const title =
    placeCat === "hotel"
      ? "Google'da gerçek oteller"
      : placeCat === "boat"
        ? "Google'da yat charter & marina"
        : "Google'da rent a car firmaları";

  return (
    <>
      <View style={[styles.refreshRow, { marginTop: 22 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.refreshKicker, { color: colors.accent }]}>
            {kicker}
          </Text>
          <Text style={[styles.refreshTitle, { color: colors.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.refreshSub, { color: colors.mutedForeground }]}>
            Google Maps verileri · puanlar gerçek müşteri yorumlarından
          </Text>
        </View>
        <Pressable
          onPress={() => places.refresh()}
          disabled={places.loading}
          accessibilityRole="button"
          accessibilityLabel="Google'dan yenile"
          style={[
            styles.refreshBtn,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          {places.loading ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Feather name="refresh-cw" size={16} color={colors.accent} />
          )}
        </Pressable>
      </View>

      <View style={styles.col}>
        {places.items.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </View>
    </>
  );
}

function AiSuggestionsBlock({
  cat,
  colors,

  onOpenUrl,
}: {
  cat: ListingCat;
  colors: ReturnType<typeof useColors>;

  onOpenUrl: (url?: string) => void;
}) {
  const ai = useAiSuggestions(cat);

  return (
    <>
      <View style={[styles.refreshRow, { marginTop: 20 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.refreshKicker, { color: colors.accent }]}>
            AI Suggestions · Status
          </Text>
          <Text style={[styles.refreshTitle, { color: colors.foreground }]}>
            AI öneri kaynağı
          </Text>
          <Text style={[styles.refreshSub, { color: colors.mutedForeground }]}>
            {ai.lastUpdated
              ? `Son kaynak sorgusu · ${new Date(ai.lastUpdated).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`
              : "Doğrulanmış sağlayıcı bağlanana kadar otomatik öneriler kapalıdır"}
          </Text>
        </View>
        <Pressable
          onPress={() => ai.refresh()}
          disabled={!ai.available || ai.loading}
          accessibilityRole="button"
          accessibilityLabel={
            ai.available
              ? "AI önerilerini yenile"
              : "AI öneri kaynağı bağlı değil"
          }
          style={[
            styles.refreshBtn,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          {ai.loading ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Feather name="zap" size={16} color={colors.accent} />
          )}
        </Pressable>
      </View>

      {ai.loading && ai.items.length === 0 && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Kaynaklı öneriler yükleniyor…
          </Text>
        </View>
      )}

      {ai.error && ai.items.length === 0 && (
        <View
          style={[
            styles.errorWrap,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <Feather name="zap" size={18} color={colors.accent} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            {friendlyMessage(ai.error)}
          </Text>
        </View>
      )}

      <View style={styles.col}>
        {ai.items.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            colors={colors}
            onAsk={() => {}}
            onOpen={() => onOpenUrl(l.url)}
          />
        ))}
      </View>
    </>
  );
}

function ListingCard({
  listing,
  colors,
  onAsk,
  onOpen,
}: {
  listing: Listing;
  colors: ReturnType<typeof useColors>;
  onAsk: () => void;
  onOpen: () => void;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.titleRow}>
        <Text style={[styles.cardTitle, { color: colors.foreground, flex: 1 }]}>
          {listing.title}
        </Text>
        <HeartLogo size={14} />
      </View>
      {!!listing.provider && (
        <Text style={[styles.meta, { color: colors.aegean }]}>
          {listing.provider}
        </Text>
      )}
      {!!listing.type && (
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>
          {listing.type}
        </Text>
      )}
      {!!listing.location && (
        <View style={styles.locRow}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
          <Text style={[styles.locText, { color: colors.mutedForeground }]}>
            {listing.location}
          </Text>
        </View>
      )}
      {!!listing.description && (
        <Text style={[styles.body, { color: colors.mutedForeground }]}>
          {listing.description}
        </Text>
      )}
      {listing.features.length > 0 && (
        <View style={styles.featGrid}>
          {listing.features.map((f) => (
            <View
              key={f}
              style={[styles.feat, { backgroundColor: colors.secondary }]}
            >
              <Text style={[styles.featText, { color: colors.accent }]}>
                {f}
              </Text>
            </View>
          ))}
        </View>
      )}
      {!!listing.priceFrom && (
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
            Başlangıç
          </Text>
          <Text style={[styles.price, { color: colors.aegeanDeep }]}>
            {listing.priceFrom}
          </Text>
        </View>
      )}
      <View style={styles.cardActions}>
        {!!listing.url && (
          <Pressable
            onPress={onOpen}
            accessibilityRole="button"
            style={[styles.actionBtn, { backgroundColor: colors.aegeanDeep }]}
          >
            <Feather name="external-link" size={13} color={"#fff"} />
            <Text style={styles.actionBtnText}>
              {listing.source ? listing.source : "Siteyi aç"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function MedicalSection({ colors }: { colors: ReturnType<typeof useColors>; }) {
  const router = useRouter();
  const q1 = useListMarketplaceProducts(marketplaceParams("HEALTH_SERVICE"));
  const q2 = useListMarketplaceProducts(marketplaceParams("DENTAL"));
  const q3 = useListMarketplaceProducts(marketplaceParams("HAIR_TRANSPLANT"));

  const isLoading = q1.isLoading || q2.isLoading || q3.isLoading;
  const isError = q1.isError || q2.isError || q3.isError;
  const isRefetching = q1.isRefetching || q2.isRefetching || q3.isRefetching;
  const refetch = () => { q1.refetch(); q2.refetch(); q3.refetch(); };

  const parsedGroups = [q1.data, q2.data, q3.data].map((response) =>
    response === undefined ? undefined : parseMarketplaceListEnvelope(response)
  );
  const malformed = parsedGroups.some((group) => group === null);
  const products = parsedGroups.flatMap((group) => group ?? []);

  return (
    <>
      <View style={styles.heroWrap}>
        <Image
          source={require("../../assets/images/medical.png")}
          style={styles.heroImg}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(8,145,178,0.85)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroBody}>
          <Text style={styles.heroKicker}>Medical Tourism</Text>
          <Text style={styles.heroTitle}>Sağlık Turizmi</Text>
          <Text style={styles.heroSub}>
            Saç ekimi · Diş · Estetik
          </Text>
        </View>
      </View>

      <View style={styles.refreshRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.refreshKicker, { color: colors.accent }]}>
            Sağlık Hizmetleri
          </Text>
          <Text style={[styles.refreshTitle, { color: colors.foreground }]}>
            Keşfet
          </Text>
          <Text style={[styles.refreshSub, { color: colors.mutedForeground }]}>
            Sağlık kurumları ve paketler.
          </Text>
        </View>
        <Pressable
          onPress={() => refetch()}
          disabled={isLoading || isRefetching}
          accessibilityRole="button"
          style={[
            styles.refreshBtn,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          {isLoading || isRefetching ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Feather name="refresh-cw" size={16} color={colors.accent} />
          )}
        </Pressable>
      </View>

      {isLoading && products.length === 0 && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Sağlık hizmetleri yükleniyor...
          </Text>
        </View>
      )}

      {(isError || malformed) && products.length === 0 && (
        <View style={[styles.errorWrap, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="alert-triangle" size={18} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            {malformed
              ? "Sağlık hizmeti verisi beklenen doğrulanmış biçimde değil."
              : "Hizmetler yüklenemedi. Lütfen tekrar deneyin."}
          </Text>
        </View>
      )}

      <View style={styles.col}>
        {products.map((p) => (
          <MarketplaceProductCard
            key={p.id}
            product={p}
            colors={colors}
            onPress={() => router.push(`/product/${p.id}` as never)}
          />
        ))}
      </View>

      {products.length === 0 && !isLoading && !isError && !malformed && (
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Şu an için listelenecek sağlık hizmeti bulunmuyor.
        </Text>
      )}
    </>
  );
}

function EstateSection({ colors }: { colors: ReturnType<typeof useColors>; }) {
  const router = useRouter();
  const q1 = useListMarketplaceProducts(marketplaceParams("PROPERTY"));
  const q2 = useListMarketplaceProducts(marketplaceParams("REAL_ESTATE_PROJECT"));
  const q3 = useListMarketplaceProducts(marketplaceParams("DEVELOPER_SERVICE"));

  const isLoading = q1.isLoading || q2.isLoading || q3.isLoading;
  const isError = q1.isError || q2.isError || q3.isError;
  const isRefetching = q1.isRefetching || q2.isRefetching || q3.isRefetching;
  const refetch = () => { q1.refetch(); q2.refetch(); q3.refetch(); };

  const parsedGroups = [q1.data, q2.data, q3.data].map((response) =>
    response === undefined ? undefined : parseMarketplaceListEnvelope(response)
  );
  const malformed = parsedGroups.some((group) => group === null);
  const products = parsedGroups.flatMap((group) => group ?? []);

  return (
    <>
      <View style={styles.heroWrap}>
        <Image
          source={require("../../assets/images/villa.png")}
          style={styles.heroImg}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(255,107,107,0.85)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroBody}>
          <Text style={styles.heroKicker}>Property</Text>
          <Text style={styles.heroTitle}>Satılık Projeler</Text>
          <Text style={styles.heroSub}>
            Çeşme, Urla, şehir merkezi
          </Text>
        </View>
      </View>

      <View style={styles.refreshRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.refreshKicker, { color: colors.accent }]}>
            Emlak Fırsatları
          </Text>
          <Text style={[styles.refreshTitle, { color: colors.foreground }]}>
            Keşfet
          </Text>
          <Text style={[styles.refreshSub, { color: colors.mutedForeground }]}>
            Yatırım & yaşam projeleri.
          </Text>
        </View>
        <Pressable
          onPress={() => refetch()}
          disabled={isLoading || isRefetching}
          accessibilityRole="button"
          style={[
            styles.refreshBtn,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          {isLoading || isRefetching ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Feather name="refresh-cw" size={16} color={colors.accent} />
          )}
        </Pressable>
      </View>

      {isLoading && products.length === 0 && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Emlak fırsatları yükleniyor...
          </Text>
        </View>
      )}

      {(isError || malformed) && products.length === 0 && (
        <View style={[styles.errorWrap, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="alert-triangle" size={18} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            {malformed
              ? "Emlak verisi beklenen doğrulanmış biçimde değil."
              : "Emlak fırsatları yüklenemedi. Lütfen tekrar deneyin."}
          </Text>
        </View>
      )}

      <View style={styles.col}>
        {products.map((p) => (
          <MarketplaceProductCard
            key={p.id}
            product={p}
            colors={colors}
            onPress={() => router.push(`/product/${p.id}` as never)}
          />
        ))}
      </View>

      {products.length === 0 && !isLoading && !isError && !malformed && (
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Şu an için listelenecek emlak fırsatı bulunmuyor.
        </Text>
      )}
    </>
  );
}

/* ---------------- Listing Form ---------------- */

function ListingForm({ colors }: { colors: ReturnType<typeof useColors> }) {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { refresh: refreshListings } = useListings("boat");
  const [category, setCategory] = useState<ListingCategory>("boat");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit =
    !!company.trim() &&
    !!email.trim() &&
    !!title.trim() &&
    !!description.trim();

  const submit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    if (!isAuthenticated) {
      void login();
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const contactParts = [contact, phone, email].filter((v) => v.trim());

    const payload = {
      category,
      title: title.trim(),
      provider: company.trim() || undefined,
      priceFrom: price.trim() || undefined,
      location: location.trim() || undefined,
      contact: contactParts.join(" · ") || undefined,
      description: description.trim() || undefined,
    };

    try {
      const res = await apiFetch("/api/listings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Gönderim başarısız (${res.status}). ${txt}`.trim());
      }
      await AsyncStorage.setItem(
        "loveizmir.listings.lastSubmit",
        JSON.stringify({ ...payload, at: new Date().toISOString() }),
      ).catch(() => {});
      void refreshListings();
      setSubmitted(true);
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Bilinmeyen bir hata oluştu.",
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    canSubmit,
    submitting,
    isAuthenticated,
    login,
    category,
    company,
    contact,
    phone,
    email,
    title,
    description,
    price,
    location,
    refreshListings,
  ]);

  const reset = () => {
    setCompany("");
    setContact("");
    setPhone("");
    setEmail("");
    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setSubmitted(false);
    setSubmitError(null);
  };

  if (submitted) {
    return (
      <View style={styles.successWrap}>
        <View
          style={[styles.successHeart, { backgroundColor: colors.secondary }]}
        >
          <HeartLogo size={48} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>
          İlanınız gönderildi!
        </Text>
        <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
          İlan ekibimize ulaştı. Editör onayından sonra Hizmetler sekmesinde
          yayına alınır — bu genelde 24 saat içinde olur.
        </Text>
        <Pressable
          onPress={reset}
          accessibilityRole="button"
          style={[styles.successBtn, { backgroundColor: colors.accent }]}
        >
          <Feather name="plus" size={16} color={"#fff"} />
          <Text style={styles.successBtnText}>Yeni ilan ekle</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={[styles.formBanner, { backgroundColor: colors.aegeanDeep }]}>
        <View
          style={[
            styles.formBannerIcon,
            { backgroundColor: "rgba(255,255,255,0.18)" },
          ]}
        >
          <Feather name="briefcase" size={20} color={"#fff"} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.formBannerKicker}>For Business</Text>
          <Text style={styles.formBannerTitle}>
            Firmanız buraya ilan versin
          </Text>
          <Text style={styles.formBannerSub}>
            Tekne, araç, ev, restoran — İzmir'e gelen herkese ulaşın.
          </Text>
        </View>
      </View>

      <SectionHeader
        kicker="Listing Form"
        title="İlan Ver"
        subtitle="Bilgileri doldurun, ekibimiz 24 saat içinde inceleyip yayına alır."
      />

      <View style={styles.formCol}>
        <Field label="Kategori *">
          <View style={styles.catRow}>
            {LISTING_CATEGORIES.map((c) => {
              const active = c.key === category;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setCategory(c.key)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={c.label}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: active ? colors.accent : colors.card,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      { color: active ? "#fff" : colors.foreground },
                    ]}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        <Field label="Firma adı *">
          <FormInput
            colors={colors}
            value={company}
            onChangeText={setCompany}
            placeholder="Örn: Çeşme Yacht Charter"
          />
        </Field>

        <View style={styles.row2}>
          <Field label="İlgili kişi" style={{ flex: 1 }}>
            <FormInput
              colors={colors}
              value={contact}
              onChangeText={setContact}
              placeholder="Ad Soyad"
            />
          </Field>
          <Field label="Telefon" style={{ flex: 1 }}>
            <FormInput
              colors={colors}
              value={phone}
              onChangeText={setPhone}
              placeholder="+90 ..."
              keyboardType="phone-pad"
            />
          </Field>
        </View>

        <Field label="E-posta *">
          <FormInput
            colors={colors}
            value={email}
            onChangeText={setEmail}
            placeholder="iletisim@firma.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Field>

        <Field label="İlan başlığı *">
          <FormInput
            colors={colors}
            value={title}
            onChangeText={setTitle}
            placeholder="Örn: 22m Premium Motor Yat - Çeşme"
          />
        </Field>

        <View style={styles.row2}>
          <Field label="Konum" style={{ flex: 1 }}>
            <FormInput
              colors={colors}
              value={location}
              onChangeText={setLocation}
              placeholder="Çeşme / Urla / Konak"
            />
          </Field>
          <Field label="Fiyat aralığı" style={{ flex: 1 }}>
            <FormInput
              colors={colors}
              value={price}
              onChangeText={setPrice}
              placeholder="€1500/gün veya 5000 TL"
            />
          </Field>
        </View>

        <Field label="Açıklama *">
          <FormInput
            colors={colors}
            value={description}
            onChangeText={setDescription}
            placeholder="Hizmetinizin detayları, kapasite, dahil olanlar..."
            multiline
            numberOfLines={5}
            style={{ minHeight: 110, textAlignVertical: "top" }}
          />
        </Field>

        {!isAuthenticated && !authLoading ? (
          <View
            style={[
              styles.notice,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="log-in" size={14} color={colors.accent} />
            <Text style={[styles.noticeText, { color: colors.foreground }]}>
              İlan göndermek için önce giriş yapmanız gerekiyor. Gönder'e
              basınca giriş ekranı açılacak.
            </Text>
          </View>
        ) : null}

        {submitError ? (
          <View
            style={[
              styles.notice,
              {
                backgroundColor: "#fdecec",
                borderColor: "#f5b5b5",
              },
            ]}
          >
            <Feather name="alert-triangle" size={14} color="#b91c1c" />
            <Text style={[styles.noticeText, { color: "#7f1d1d" }]}>
              {submitError}
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={submit}
          disabled={!canSubmit || submitting || authLoading}
          accessibilityRole="button"
          accessibilityLabel="İlanı gönder"
          accessibilityState={{
            disabled: !canSubmit || submitting || authLoading,
          }}
          style={[
            styles.submitBtn,
            {
              backgroundColor: canSubmit ? colors.accent : colors.muted,
              opacity: submitting ? 0.7 : 1,
            },
          ]}
        >
          <HeartLogo size={16} />
          <Text style={styles.submitText}>
            {submitting
              ? "Gönderiliyor…"
              : !isAuthenticated
                ? "Giriş yap ve gönder"
                : "İlanı Gönder"}
          </Text>
          <Feather name="send" size={16} color={"#fff"} />
        </Pressable>

        <View
          style={[
            styles.notice,
            {
              backgroundColor: colors.secondary,
              borderColor: colors.border,
            },
          ]}
        >
          <Feather name="info" size={14} color={colors.accent} />
          <Text style={[styles.noticeText, { color: colors.foreground }]}>
            İlanlar editör onayından sonra yayınlanır. Sahte/yanıltıcı bilgi
            içeren ilanlar kaldırılır. Yayın ücreti için ekibimiz sizinle
            iletişime geçer.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ---------------- Reusable bits ---------------- */

function BookCta({
  colors,
  label = "Müsaitlik & rezervasyon sor",
}: {
  colors: ReturnType<typeof useColors>;
  label?: string;
}) {
  return (
    <View style={styles.bookCta}>
      <Feather name="message-circle" size={13} color={colors.accent} />
      <Text style={[styles.bookCtaText, { color: colors.accent }]}>
        {label}
      </Text>
      <Feather name="arrow-right" size={13} color={colors.accent} />
    </View>
  );
}

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: object;
}) {
  const colors = useColors();
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function FormInput({
  colors,
  style,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.mutedForeground}
      style={[
        styles.input,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.foreground,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  marketplaceMediaPlaceholder: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  marketplaceMediaAction: {
    minHeight: 44,
    minWidth: 120,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  segRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  segChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  segLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  heroWrap: {
    height: 180,
    marginHorizontal: 20,
    marginTop: 6,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  heroBody: { padding: 18, gap: 2 },
  heroKicker: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    lineHeight: 30,
  },
  heroSub: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    marginTop: 4,
  },

  col: { paddingHorizontal: 20, gap: 12 },

  card: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 10 },
  bigCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  bigImg: { width: "100%", height: 160 },
  bigBody: { padding: 16, gap: 8 },

  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  cardEn: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 2,
  },
  meta: { fontFamily: "Inter_500Medium", fontSize: 12 },
  body: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.2,
  },

  featGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  feat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  featText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.3,
  },
  tag: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  tagText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  priceLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  price: { fontFamily: "Poppins_700Bold", fontSize: 20 },

  bookCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  bookCtaText: { fontFamily: "Inter_600SemiBold", fontSize: 13, flex: 1 },

  medHead: { flexDirection: "row", alignItems: "center", gap: 14 },
  medEmoji: { fontSize: 32 },

  /* listing form */
  formBanner: {
    marginHorizontal: 20,
    marginTop: 6,
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  formBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  formBannerKicker: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  formBannerTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
    marginTop: 2,
  },
  formBannerSub: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    marginTop: 2,
  },

  formCol: { paddingHorizontal: 20, gap: 16, marginTop: 4 },
  fieldLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  row2: { flexDirection: "row", gap: 12 },
  catRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  catChipText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },

  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  submitText: { color: "#fff", fontFamily: "Poppins_700Bold", fontSize: 15 },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  noticeText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 17,
  },

  successWrap: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 30,
    gap: 14,
  },
  successHeart: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    textAlign: "center",
  },
  successSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  successBtn: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  successBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  refreshRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  refreshKicker: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  refreshTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    marginTop: 2,
  },
  refreshSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingWrap: {
    alignItems: "center",
    gap: 10,
    padding: 24,
  },
  loadingText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  errorWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
  },
  actionBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  emailBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  emailBoxText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
});
