import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Linking,
} from "react-native";

const { width: windowWidth } = Dimensions.get("window");
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeartLogo } from "@/components/HeartLogo";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/lib/auth";
import {
  useGetMarketplaceProduct,
  useGetProductAvailability,
  useRequestMarketplaceProduct,
  useGetMeFavorites,
  useSaveMeFavorite,
  useRemoveMeFavorite,
  getGetMeFavoritesQueryKey,
  getGetMarketplaceProductQueryKey,
  getGetProductAvailabilityQueryKey,
  type ProductCtaBody,
  type RequestMarketplaceProductHeaders,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useMasterAi } from "@/contexts/MasterAiContext";
import { getApiBase } from "@/lib/apiClient";

import { Image } from "expo-image";

const PUBLIC_PRODUCT_TYPES = [
  "RESTAURANT", "HOTEL", "VILLA", "BOAT", "YACHT", "MARINA", "BEACH",
  "WINERY", "CAFE", "EVENT", "THEATRE", "CINEMA", "CONCERT", "EXPERIENCE",
  "REAL_ESTATE_PROJECT", "PROPERTY", "DEVELOPER_SERVICE", "HEALTH_SERVICE",
  "DENTAL", "HAIR_TRANSPLANT", "WELLNESS", "TRANSFER", "TOUR", "GUIDE",
  "SERVICE", "OTHER",
] as const;
type PublicProductType = (typeof PUBLIC_PRODUCT_TYPES)[number];

type PublicProductMedia = {
  id: string;
  mediaKind: "IMAGE" | "VIDEO" | "DOCUMENT";
  url?: string | null;
};

type PublicProductDetail =
  | { detailType: "RESTAURANT"; revision: number; cuisineTags: string[]; servicePeriods: string[]; guestCapacity: number | null; indoorOutdoor: string | null; menuUrl: string | null; averageSpendMinor: number | null; parking: boolean; valet: boolean; dressVibe: string | null; kidsFriendly: boolean; petFriendly: boolean; accessibility: string | null }
  | { detailType: "STAY"; revision: number; roomType: string | null; occupancy: number | null; beds: number | null; amenities: string[]; checkIn: string | null; checkOut: string | null; minimumStay: number | null; inventoryUnits: number | null; seasonalAvailability: boolean }
  | { detailType: "VESSEL"; revision: number; vesselType: string | null; marina: string | null; capacity: number | null; captainIncluded: boolean; durationOptions: string[]; fuelPolicy: string | null; depositPolicy: string | null; amenities: string[]; departurePoint: string | null; returnPoint: string | null }
  | { detailType: "EVENT"; revision: number; eventType: string | null; venue: string | null; startsAt: string | null; endsAt: string | null; capacity: number | null; ticketMode: string | null; ticketUrl: string | null; agePolicy: string | null; organizer: string | null }
  | { detailType: "REAL_ESTATE"; revision: number; projectType: string | null; developer: string | null; unitTypes: string[]; deliveryDate: string | null; priceFromMinor: number | null; priceToMinor: number | null; brochureMediaId: string | null; salesOffice: string | null; projectStatus: string | null; leadMode: string | null; regulatoryDisclosure: string }
  | { detailType: "HEALTH"; revision: number; serviceType: string | null; clinic: string | null; providerDisplay: string | null; consultationMode: string | null; regulatoryDisclosure: string; reviewRequired: true };

type PublicProduct = {
  id: string;
  productType: PublicProductType;
  titleTr?: string | null;
  titleEn?: string | null;
  businessName?: string | null;
  category?: string | null;
  descriptionTr?: string | null;
  descriptionEn?: string | null;
  primaryMediaId?: string | null;
  media: PublicProductMedia[];
  detail?: PublicProductDetail | null;
  amountMinor?: number | null;
  currency?: string | null;
  priceMode?: string | null;
  cancellationPolicy?: { mode: string; customTr?: string | null } | null;
  availability?: {
    mode: "NONE" | "MANUAL" | "SLOT_BASED" | "UNIT_BASED" | "EXTERNAL_PROVIDER";
    timezone: string | null;
    providerStatus: "NOT_CONFIGURED" | "CONFIGURED" | "DEGRADED" | "UNAVAILABLE";
    truth: "PERSISTED" | "NOT_CONFIGURED" | "NO_AVAILABILITY_CLAIM" | "REQUEST_ONLY";
  } | null;
  cta: {
    enabled: boolean;
    reservationMode:
      | "INSTANT_BOOK" | "REQUEST_TO_BOOK" | "MANUAL_CONFIRMATION"
      | "LEAD_ONLY" | "EXTERNAL_BOOKING" | "WHATSAPP_ASSISTED"
      | "BUY_REQUEST" | "RESERVE_REQUEST";
    externalUrl: string | null;
    whatsappTarget: string | null;
    status: "AVAILABLE" | "NOT_CONFIGURED" | "UNAVAILABLE";
  };
};

type FavoriteItem = { entityType: string; entityId: string };

type AvailabilitySlot = {
  id: string; startsAt: string; endsAt: string; capacity: number; booked: number;
  held: number; available: number; status: string; revision: number;
};
type AvailabilityUnit = {
  id: string; sku: string; label: string; remaining: number; status: string; revision: number;
};
type AvailabilityProjection = {
  asOf: string;
  timezone: string;
  mode: "NONE" | "MANUAL" | "SLOT_BASED" | "UNIT_BASED" | "EXTERNAL_PROVIDER";
  source: "NONE" | "PARTNER_MANUAL" | "PERSISTED_SLOTS" | "PERSISTED_UNITS" | "EXTERNAL_PROVIDER";
  status: "NOT_CONFIGURED" | "NO_AVAILABILITY_CLAIM" | "REQUEST_ONLY" | "CONFIGURED";
  slots: AvailabilitySlot[];
  units: AvailabilityUnit[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isPublicProductType(value: unknown): value is PublicProductType {
  return typeof value === "string" &&
    PUBLIC_PRODUCT_TYPES.some((type) => type === value);
}

function isPublicProductDetail(value: unknown): value is PublicProductDetail {
  if (!isRecord(value) || typeof value.revision !== "number" ||
      !Number.isInteger(value.revision)) return false;
  switch (value.detailType) {
    case "RESTAURANT":
      return isStringArray(value.cuisineTags) && isStringArray(value.servicePeriods) &&
        isNullableNumber(value.guestCapacity) && isNullableString(value.indoorOutdoor) &&
        isNullableString(value.menuUrl) && isNullableNumber(value.averageSpendMinor) &&
        typeof value.parking === "boolean" && typeof value.valet === "boolean" &&
        isNullableString(value.dressVibe) && typeof value.kidsFriendly === "boolean" &&
        typeof value.petFriendly === "boolean" && isNullableString(value.accessibility);
    case "STAY":
      return isNullableString(value.roomType) && isNullableNumber(value.occupancy) &&
        isNullableNumber(value.beds) && isStringArray(value.amenities) &&
        isNullableString(value.checkIn) && isNullableString(value.checkOut) &&
        isNullableNumber(value.minimumStay) && isNullableNumber(value.inventoryUnits) &&
        typeof value.seasonalAvailability === "boolean";
    case "VESSEL":
      return isNullableString(value.vesselType) && isNullableString(value.marina) &&
        isNullableNumber(value.capacity) && typeof value.captainIncluded === "boolean" &&
        isStringArray(value.durationOptions) && isNullableString(value.fuelPolicy) &&
        isNullableString(value.depositPolicy) && isStringArray(value.amenities) &&
        isNullableString(value.departurePoint) && isNullableString(value.returnPoint);
    case "EVENT":
      return isNullableString(value.eventType) && isNullableString(value.venue) &&
        isNullableString(value.startsAt) && isNullableString(value.endsAt) &&
        isNullableNumber(value.capacity) && isNullableString(value.ticketMode) &&
        isNullableString(value.ticketUrl) && isNullableString(value.agePolicy) &&
        isNullableString(value.organizer);
    case "REAL_ESTATE":
      return isNullableString(value.projectType) && isNullableString(value.developer) &&
        isStringArray(value.unitTypes) && isNullableString(value.deliveryDate) &&
        isNullableNumber(value.priceFromMinor) && isNullableNumber(value.priceToMinor) &&
        isNullableString(value.brochureMediaId) && isNullableString(value.salesOffice) &&
        isNullableString(value.projectStatus) && isNullableString(value.leadMode) &&
        typeof value.regulatoryDisclosure === "string" && value.regulatoryDisclosure.trim().length > 0;
    case "HEALTH":
      return isNullableString(value.serviceType) && isNullableString(value.clinic) &&
        isNullableString(value.providerDisplay) && isNullableString(value.consultationMode) &&
        typeof value.regulatoryDisclosure === "string" &&
        value.regulatoryDisclosure.trim().length > 0 && value.reviewRequired === true;
    default:
      return false;
  }
}

function isPublicProduct(value: unknown): value is PublicProduct {
  if (!isRecord(value) || !isRecord(value.cta)) return false;
  const cta = value.cta;
  const reservationModes = [
    "INSTANT_BOOK", "REQUEST_TO_BOOK", "MANUAL_CONFIRMATION", "LEAD_ONLY",
    "EXTERNAL_BOOKING", "WHATSAPP_ASSISTED", "BUY_REQUEST", "RESERVE_REQUEST",
  ];
  const cancellation = value.cancellationPolicy;
  const availability = value.availability;
  return typeof value.id === "string" &&
    isPublicProductType(value.productType) &&
    isOptionalString(value.titleTr) && isOptionalString(value.titleEn) &&
    (typeof value.titleTr === "string" || typeof value.titleEn === "string") &&
    isOptionalString(value.businessName) && isOptionalString(value.category) &&
    isOptionalString(value.descriptionTr) && isOptionalString(value.descriptionEn) &&
    isOptionalString(value.primaryMediaId) &&
    Array.isArray(value.media) && value.media.every((media) =>
      isRecord(media) && typeof media.id === "string" &&
      (media.mediaKind === "IMAGE" || media.mediaKind === "VIDEO" || media.mediaKind === "DOCUMENT") &&
      isOptionalString(media.url)) &&
    (value.detail === undefined || value.detail === null || isPublicProductDetail(value.detail)) &&
    (value.amountMinor === undefined || value.amountMinor === null || typeof value.amountMinor === "number") &&
    isOptionalString(value.currency) && isOptionalString(value.priceMode) &&
    (cancellation === undefined || cancellation === null ||
      (isRecord(cancellation) && typeof cancellation.mode === "string" &&
        isOptionalString(cancellation.customTr))) &&
    (availability === undefined || availability === null ||
      (isRecord(availability) &&
        (availability.mode === "NONE" || availability.mode === "MANUAL" ||
          availability.mode === "SLOT_BASED" || availability.mode === "UNIT_BASED" ||
          availability.mode === "EXTERNAL_PROVIDER") &&
        isNullableString(availability.timezone) &&
        (availability.providerStatus === "NOT_CONFIGURED" ||
          availability.providerStatus === "CONFIGURED" ||
          availability.providerStatus === "DEGRADED" ||
          availability.providerStatus === "UNAVAILABLE") &&
        (availability.truth === "PERSISTED" ||
          availability.truth === "NOT_CONFIGURED" ||
          availability.truth === "NO_AVAILABILITY_CLAIM" ||
          availability.truth === "REQUEST_ONLY"))) &&
    typeof cta.enabled === "boolean" &&
    typeof cta.reservationMode === "string" &&
    reservationModes.includes(cta.reservationMode) &&
    isOptionalString(cta.externalUrl) && isOptionalString(cta.whatsappTarget) &&
    (cta.status === "AVAILABLE" || cta.status === "NOT_CONFIGURED" || cta.status === "UNAVAILABLE");
}

function parseProductEnvelope(value: unknown): PublicProduct | null {
  if (!isRecord(value) || !isRecord(value.data) || !isRecord(value.meta) || value.error !== null) return null;
  return isPublicProduct(value.data.product) ? value.data.product : null;
}

function isAvailabilitySlot(value: unknown): value is AvailabilitySlot {
  return isRecord(value) && typeof value.id === "string" &&
    typeof value.startsAt === "string" && typeof value.endsAt === "string" &&
    typeof value.capacity === "number" && typeof value.booked === "number" &&
    typeof value.held === "number" && typeof value.available === "number" &&
    typeof value.status === "string" && typeof value.revision === "number";
}

function isAvailabilityUnit(value: unknown): value is AvailabilityUnit {
  return isRecord(value) && typeof value.id === "string" &&
    typeof value.sku === "string" && typeof value.label === "string" &&
    typeof value.remaining === "number" && typeof value.status === "string" &&
    typeof value.revision === "number";
}

function isAvailabilityProjection(data: unknown): data is AvailabilityProjection {
  return isRecord(data) &&
    typeof data.asOf === "string" && typeof data.timezone === "string" &&
    (data.mode === "NONE" || data.mode === "MANUAL" || data.mode === "SLOT_BASED" ||
      data.mode === "UNIT_BASED" || data.mode === "EXTERNAL_PROVIDER") &&
    (data.source === "NONE" || data.source === "PARTNER_MANUAL" ||
      data.source === "PERSISTED_SLOTS" || data.source === "PERSISTED_UNITS" ||
      data.source === "EXTERNAL_PROVIDER") &&
    (data.status === "NOT_CONFIGURED" || data.status === "NO_AVAILABILITY_CLAIM" ||
      data.status === "REQUEST_ONLY" || data.status === "CONFIGURED") &&
    Array.isArray(data.slots) && data.slots.every(isAvailabilitySlot) &&
    Array.isArray(data.units) && data.units.every(isAvailabilityUnit);
}

function parseAvailabilityEnvelope(value: unknown): AvailabilityProjection | null {
  if (!isRecord(value) || !isRecord(value.meta) || value.error !== null) return null;
  return isAvailabilityProjection(value.data) ? value.data : null;
}

function parseFavoritesEnvelope(value: unknown): FavoriteItem[] | null {
  if (!isRecord(value) || !isRecord(value.data) || !isRecord(value.meta) ||
      value.error !== null || !Array.isArray(value.data.items)) return null;
  return value.data.items.every((item): item is FavoriteItem =>
    isRecord(item) && typeof item.entityType === "string" && typeof item.entityId === "string"
  ) ? value.data.items : null;
}

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, login } = useAuth();
  const queryClient = useQueryClient();
  const { openAndSend } = useMasterAi();

  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = Platform.OS === "web" ? 24 : (insets.bottom || 0) + 16;

  // Queries
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useGetMarketplaceProduct(productId || "", {
    query: {
      enabled: !!productId,
      queryKey: getGetMarketplaceProductQueryKey(productId!),
      retry: false,
    },
  });

  const {
    data: availabilityData,
    isLoading: availabilityLoading,
    isError: availabilityError,
  } = useGetProductAvailability(productId || "", {
    query: {
      enabled: !!productId,
      queryKey: getGetProductAvailabilityQueryKey(productId!),
      retry: false,
    },
  });

  const { data: favoritesData } = useGetMeFavorites({
    query: { enabled: !!user?.id, queryKey: [...getGetMeFavoritesQueryKey(), user?.id] },
  });

  // Mutations
  const saveFavorite = useSaveMeFavorite();
  const removeFavorite = useRemoveMeFavorite();
  const requestProduct = useRequestMarketplaceProduct();

  // State
  const product =
    productData === undefined ? undefined : parseProductEnvelope(productData);
  const productMalformed = productData !== undefined && product === null;
  const availability =
    availabilityData === undefined ? undefined : parseAvailabilityEnvelope(availabilityData);
  const availabilityMalformed =
    availabilityData !== undefined && availability === null;
  const parsedFavorites =
    favoritesData === undefined ? undefined : parseFavoritesEnvelope(favoritesData);
  const favoritesMalformed =
    favoritesData !== undefined && parsedFavorites === null;
  const favorites = parsedFavorites ?? [];
  const isFavorited = favorites.some(
    (f) => f.entityType === "PRODUCT" && f.entityId === productId
  );

  const [requestStatus, setRequestStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const idempotencyKeyRef = React.useRef(Math.random().toString(36).substring(7));

  const toggleFavorite = () => {
    if (!user) {
      login();
      return;
    }
    if (isFavorited) {
      removeFavorite.mutate(
        { data: { entityId: productId!, entityType: "PRODUCT" } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [...getGetMeFavoritesQueryKey(), user?.id],
            });
          },
        }
      );
    } else {
      saveFavorite.mutate(
        { data: { entityId: productId!, entityType: "PRODUCT" } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [...getGetMeFavoritesQueryKey(), user?.id],
            });
          },
        }
      );
    }
  };

  const cta = product?.cta;
  const isExternal = cta?.reservationMode === "EXTERNAL_BOOKING" || cta?.reservationMode === "WHATSAPP_ASSISTED";
  const externalMissing = !!cta && isExternal && !cta.externalUrl && !cta.whatsappTarget;
  const ctaDisabled = !cta?.enabled || requestStatus === "LOADING" || externalMissing || cta.status === "UNAVAILABLE";

  const handleRequest = () => {
    if (!cta || ctaDisabled) return;

    if (isExternal) {
      if (cta.externalUrl) {
        Linking.openURL(cta.externalUrl).catch(() => {
          Alert.alert("Hata", "Bağlantı açılamadı.");
        });
      } else if (cta.whatsappTarget) {
        Linking.openURL(`https://wa.me/${cta.whatsappTarget.replace(/\D/g, "")}`).catch(() => {
          Alert.alert("Hata", "WhatsApp açılamadı.");
        });
      }
      return;
    }

    if (!user) {
      login();
      return;
    }

    setRequestStatus("LOADING");
    requestProduct.mutate(
      {
        headers: {
          "Idempotency-Key": `${productId}-${idempotencyKeyRef.current}`,
        } satisfies RequestMarketplaceProductHeaders,
        data: {
          message: "I would like to request this product.",
        } satisfies ProductCtaBody,
        productId: productId!
      },
      {
        onSuccess: () => {
          setRequestStatus("SUCCESS");
          idempotencyKeyRef.current = Math.random().toString(36).substring(7);
          Alert.alert("Talep Alındı", "Talebiniz başarıyla iletildi. Sağlayıcı en kısa sürede dönüş yapacaktır.");
        },
        onError: () => {
          setRequestStatus("ERROR");
          Alert.alert("Hata", "Talep oluşturulurken bir hata meydana geldi.");
        },
      }
    );
  };

  const handleAskAi = () => {
    if (!product) return;
    const prompt = `[${product.titleTr || product.titleEn} (ID: ${productId})] ürünü hakkında bilgi ver. Müsaitliği ve iptal koşulları nedir?`;
    openAndSend(prompt);
  };

  const ctaLabel = (() => {
    if (!cta?.enabled || externalMissing || cta.status === "UNAVAILABLE") return "Mevcut Değil";
    if (isExternal) return cta.whatsappTarget ? "WhatsApp ile Sor" : "Siteye Git";
    if (cta.reservationMode === "BUY_REQUEST") return "Satın Alma Talebi";
    if (cta.reservationMode === "RESERVE_REQUEST" || cta.reservationMode === "REQUEST_TO_BOOK") return "Rezervasyon Talebi";
    return "Talep Gönder";
  })();


  if (productLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Ürün Detayı" }} />
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </>
    );
  }

  if (productError || availabilityError || !product || productMalformed || availabilityMalformed || favoritesMalformed) {
    return (
      <>
        <Stack.Screen options={{ title: "Ürün Detayı" }} />
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.destructive }}>
            {productMalformed || availabilityMalformed || favoritesMalformed
              ? "Ürün verisi beklenen doğrulanmış biçimde değil."
              : availabilityError
                ? "Doğrulanmış müsaitlik bilgisi şu anda kullanılamıyor."
              : "Ürün bulunamadı veya yüklenemedi."}
          </Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: colors.primary }}>Geri Dön</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: product.titleTr || product.titleEn || "Ürün Detayı" }} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topInset + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.secondary }]}>
          <Feather name="arrow-left" size={20} color={colors.accent} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
          {product.titleTr || product.titleEn}
        </Text>
        <Pressable testID="favorite-btn" onPress={toggleFavorite} style={[styles.iconBtn, { backgroundColor: colors.secondary }]}>
          <Feather name="heart" size={20} color={isFavorited ? colors.accent : colors.mutedForeground} fill={isFavorited ? colors.accent : "transparent"} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: bottomInset + 100 }}>
        {/* Gallery */}
        {product?.media && Array.isArray(product.media) && product.media.length > 0 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ height: 250 }}>
            {product.media.map((m, idx) => {
              if (m.mediaKind === "IMAGE") {
                return (
                  <Image
                    key={m.id || idx}
                    source={{ uri: `${getApiBase()}/api/v1/products/${productId}/media/${m.id}` }}
                    style={{ width: windowWidth, height: 250 }}
                    contentFit="cover"
                  />
                );
              }
              // For VIDEO/DOCUMENT
              return (
                <View key={m.id || idx} style={[styles.center, { width: windowWidth, height: 250, backgroundColor: colors.secondary }]}>
                  <Feather name={m.mediaKind === "VIDEO" ? "video" : "file-text"} size={32} color={colors.accent} />
                  <Pressable onPress={() => {
    const url = m.url ? (m.url.startsWith("http") ? m.url : `${getApiBase()}${m.url.startsWith("/") ? "" : "/"}${m.url}`) : undefined;
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  }} style={{ marginTop: 12, padding: 8, backgroundColor: colors.card, borderRadius: 8 }}>
                    <Text style={{ color: colors.foreground }}>{m.mediaKind === "VIDEO" ? "Videoyu İzle" : "Dökümanı Aç"}</Text>
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        ) : product?.primaryMediaId ? (
          <Image
            source={{ uri: `${getApiBase()}/api/v1/products/${productId}/media/${product.primaryMediaId}` }}
            style={{ width: windowWidth, height: 250 }}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.center, { width: windowWidth, height: 250, backgroundColor: colors.secondary }]}>
             <Feather name="image" size={32} color={colors.mutedForeground} />
          </View>
        )}

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.foreground }]}>{product.titleTr || product.titleEn}</Text>
          <Text style={[styles.businessName, { color: colors.aegeanDeep }]}>{product.businessName}</Text>
          <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.tagText, { color: colors.accent }]}>{product.productType}</Text>
            </View>
            {!!product.category && (
              <View style={[styles.tag, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.tagText, { color: colors.accent }]}>{product.category}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Açıklama</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>{product.descriptionTr || product.descriptionEn}</Text>
        </View>

        {/* Discriminated Detail (if available) */}
        {product?.detail && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Detaylar</Text>
            {product.detail.detailType === "RESTAURANT" && (
              <>
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Mutfak: {product.detail.cuisineTags.join(", ") || "Belirtilmemiş"}</Text>
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Servis: {product.detail.servicePeriods.join(", ") || "Belirtilmemiş"}</Text>
                {product.detail.guestCapacity !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Kapasite: {product.detail.guestCapacity}</Text>}
                {product.detail.indoorOutdoor !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Alan: {product.detail.indoorOutdoor}</Text>}
                {product.detail.menuUrl !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Menü: {product.detail.menuUrl}</Text>}
                {product.detail.averageSpendMinor !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Ortalama Harcama: {(product.detail.averageSpendMinor / 100).toFixed(2)}</Text>}
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Otopark: {product.detail.parking ? "Var" : "Yok"} · Vale: {product.detail.valet ? "Var" : "Yok"}</Text>
                {product.detail.dressVibe !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Stil: {product.detail.dressVibe}</Text>}
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Çocuk Dostu: {product.detail.kidsFriendly ? "Evet" : "Hayır"} · Evcil Hayvan: {product.detail.petFriendly ? "Evet" : "Hayır"}</Text>
                {product.detail.accessibility !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Erişilebilirlik: {product.detail.accessibility}</Text>}
              </>
            )}
            {product.detail.detailType === "STAY" && (
              <>
                {product.detail.roomType !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Oda Tipi: {product.detail.roomType}</Text>}
                {product.detail.occupancy !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Doluluk: {product.detail.occupancy}</Text>}
                {product.detail.beds !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Yatak: {product.detail.beds}</Text>}
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Olanaklar: {product.detail.amenities.join(", ") || "Belirtilmemiş"}</Text>
                {product.detail.checkIn !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Giriş: {product.detail.checkIn}</Text>}
                {product.detail.checkOut !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Çıkış: {product.detail.checkOut}</Text>}
                {product.detail.minimumStay !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Minimum Konaklama: {product.detail.minimumStay}</Text>}
                {product.detail.inventoryUnits !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Envanter Birimi: {product.detail.inventoryUnits}</Text>}
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Sezonluk Müsaitlik: {product.detail.seasonalAvailability ? "Evet" : "Hayır"}</Text>
              </>
            )}
            {product.detail.detailType === "VESSEL" && (
              <>
                {product.detail.vesselType !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Tekne Tipi: {product.detail.vesselType}</Text>}
                {product.detail.marina !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Marina: {product.detail.marina}</Text>}
                {product.detail.capacity !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Kapasite: {product.detail.capacity}</Text>}
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Kaptan Dahil: {product.detail.captainIncluded ? "Evet" : "Hayır"}</Text>
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Süreler: {product.detail.durationOptions.join(", ") || "Belirtilmemiş"}</Text>
                {product.detail.fuelPolicy !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Yakıt Politikası: {product.detail.fuelPolicy}</Text>}
                {product.detail.depositPolicy !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Depozito: {product.detail.depositPolicy}</Text>}
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Olanaklar: {product.detail.amenities.join(", ") || "Belirtilmemiş"}</Text>
                {product.detail.departurePoint !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Kalkış: {product.detail.departurePoint}</Text>}
                {product.detail.returnPoint !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Dönüş: {product.detail.returnPoint}</Text>}
              </>
            )}
            {product.detail.detailType === "EVENT" && (
              <>
                {product.detail.eventType !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Etkinlik: {product.detail.eventType}</Text>}
                {product.detail.venue !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Mekan: {product.detail.venue}</Text>}
                {product.detail.startsAt !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Başlangıç: {product.detail.startsAt}</Text>}
                {product.detail.endsAt !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Bitiş: {product.detail.endsAt}</Text>}
                {product.detail.capacity !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Kapasite: {product.detail.capacity}</Text>}
                {product.detail.ticketMode !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Bilet Modu: {product.detail.ticketMode}</Text>}
                {product.detail.ticketUrl !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Bilet: {product.detail.ticketUrl}</Text>}
                {product.detail.agePolicy !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Yaş Politikası: {product.detail.agePolicy}</Text>}
                {product.detail.organizer !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Organizatör: {product.detail.organizer}</Text>}
              </>
            )}
            {product.detail.detailType === "REAL_ESTATE" && (
              <>
                {product.detail.projectType !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Proje: {product.detail.projectType}</Text>}
                {product.detail.developer !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Geliştirici: {product.detail.developer}</Text>}
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Birimler: {product.detail.unitTypes.join(", ") || "Belirtilmemiş"}</Text>
                {product.detail.deliveryDate !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Teslim: {product.detail.deliveryDate}</Text>}
                {product.detail.priceFromMinor !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Başlangıç Fiyatı: {(product.detail.priceFromMinor / 100).toFixed(2)}</Text>}
                {product.detail.priceToMinor !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Üst Fiyat: {(product.detail.priceToMinor / 100).toFixed(2)}</Text>}
                {product.detail.brochureMediaId !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Broşür: {product.detail.brochureMediaId}</Text>}
                {product.detail.salesOffice !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Satış Ofisi: {product.detail.salesOffice}</Text>}
                {product.detail.projectStatus !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Proje Durumu: {product.detail.projectStatus}</Text>}
                {product.detail.leadMode !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Satış Modu: {product.detail.leadMode}</Text>}
              </>
            )}
            {product.detail.detailType === "HEALTH" && (
              <>
                {product.detail.serviceType !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Hizmet: {product.detail.serviceType}</Text>}
                {product.detail.clinic !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Klinik: {product.detail.clinic}</Text>}
                {product.detail.providerDisplay !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Sağlayıcı: {product.detail.providerDisplay}</Text>}
                {product.detail.consultationMode !== null && <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Konsültasyon: {product.detail.consultationMode}</Text>}
                <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>İnceleme Gerekli: {product.detail.reviewRequired ? "Evet" : "Hayır"}</Text>
              </>
            )}
          </View>
        )}

        {/* Pricing & Policy */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Fiyat & Politika</Text>
          <View style={[styles.policyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.policyRow}>
              <Feather name="credit-card" size={16} color={colors.mutedForeground} />
              <Text style={[styles.policyText, { color: colors.foreground }]}>
                Fiyat: {product?.amountMinor ? `${(product.amountMinor / 100).toFixed(2)} ${product.currency}` : "Soruşturun"} {product?.priceMode ? `(${product.priceMode})` : ""}
              </Text>
            </View>
            {product?.cancellationPolicy && (
              <>
                <View style={styles.policyRow}>
                  <Feather name="shield" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.policyText, { color: colors.foreground }]}>
                    İptal Politikası: {product.cancellationPolicy.mode}
                  </Text>
                </View>
                {product.cancellationPolicy.customTr && (
                  <Text style={[styles.customPolicy, { color: colors.mutedForeground }]}>{product.cancellationPolicy.customTr}</Text>
                )}
              </>
            )}
          </View>
        </View>

        {/* Availability */}
        {availabilityLoading && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Müsaitlik Durumu</Text>
            <ActivityIndicator color={colors.accent} />
          </View>
        )}
        {availability && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Müsaitlik Durumu</Text>
            <View style={[styles.policyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
               <Text style={[styles.policyText, { color: colors.foreground }]}>Durum: {availability.status}</Text>
               <Text style={[styles.policyText, { color: colors.foreground }]}>Kaynak: {availability.source}</Text>
               <Text style={[styles.policyText, { color: colors.foreground }]}>Mod: {availability.mode}</Text>
               <Text style={[styles.policyText, { color: colors.foreground }]}>Zaman Dilimi: {availability.timezone}</Text>
               <Text style={[styles.policyText, { color: colors.foreground }]}>Güncellik: {availability.asOf}</Text>
               <Text style={[styles.policyText, { color: colors.foreground }]}>
                 Doğruluk: {availability.status === "CONFIGURED" ? "PERSISTED" : availability.status}
               </Text>
               <Text style={[styles.policyText, { color: colors.foreground }]}>
                 Müsait Slot: {availability.slots.filter((slot) => slot.available > 0).length} ·
                 Müsait Birim: {availability.units.reduce((total, unit) => total + unit.remaining, 0)}
               </Text>
               {availability.slots.map((slot) => (
                 <View key={slot.id} style={{ gap: 2 }}>
                   <Text style={[styles.policyText, { color: colors.foreground }]}>Slot: {slot.startsAt} — {slot.endsAt}</Text>
                   <Text style={[styles.detailItem, { color: colors.mutedForeground }]}>Müsait: {slot.available} / {slot.capacity} · Rezerve: {slot.booked} · Bekleyen: {slot.held} · {slot.status}</Text>
                 </View>
               ))}
               {availability.units.map((unit) => (
                 <Text key={unit.id} style={[styles.policyText, { color: colors.foreground }]}>
                   Birim: {unit.label} ({unit.sku}) · Müsait: {unit.remaining} · {unit.status}
                 </Text>
               ))}
            </View>
          </View>
        )}

        {/* Regulatory Disclosure */}
        {product?.detail && (product.detail.detailType === "HEALTH" || product.detail.detailType === "REAL_ESTATE") && product.detail.regulatoryDisclosure && (
          <View style={styles.section}>
             <Text style={[styles.sectionTitle, { color: colors.destructive, fontSize: 14 }]}>Yasal Uyarı</Text>
             <Text style={[styles.description, { color: colors.mutedForeground, fontSize: 12 }]}>{product.detail.regulatoryDisclosure}</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={[styles.fab, { paddingBottom: bottomInset, backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Pressable
          testID="ask-ai-btn"
          onPress={handleAskAi}
          style={[styles.aiBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
        >
          <HeartLogo size={16} />
          <Text style={[styles.aiBtnText, { color: colors.foreground }]}>Sor</Text>
        </Pressable>
        <Pressable
          testID="product-cta-btn"
          onPress={handleRequest}
          disabled={ctaDisabled}
          style={[
            styles.ctaBtn,
            { backgroundColor: ctaDisabled ? colors.mutedForeground : colors.accent },
          ]}
        >
          {requestStatus === "LOADING" ? (
            <ActivityIndicator color={colors.accentForeground} />
          ) : (
            <Text style={[styles.ctaBtnText, { color: colors.accentForeground }]}>
              {ctaLabel}
            </Text>
          )}
        </Pressable>
      </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    padding: 20,
    gap: 8,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
  },
  businessName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
  },
  detailItem: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  policyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  policyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  policyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    flex: 1,
  },
  customPolicy: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(150,150,150,0.2)",
  },
  fab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    gap: 8,
  },
  aiBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  ctaBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 28,
  },
  ctaBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});
