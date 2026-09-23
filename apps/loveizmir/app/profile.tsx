import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { HeartLogo } from "@/components/HeartLogo";
import { AiBrainControls } from "@/components/AiBrainControls";
import { IntegrationStatusCard } from "@/components/IntegrationStatusCard";
import { PassportGrid } from "@/components/PassportGrid";
import { useLanguage } from "@/contexts/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

import {
  useGetMe,
  getGetMeQueryKey,
  useGetMeDashboard,
  getGetMeDashboardQueryKey,
  useGetMeFavorites,
  getGetMeFavoritesQueryKey,
  useGetMeCollections,
  getGetMeCollectionsQueryKey,
  useGetMeReservations,
  getGetMeReservationsQueryKey,
  useGetMeRequests,
  getGetMeRequestsQueryKey,
  useGetMeNotificationPreferences,
  getGetMeNotificationPreferencesQueryKey,
  useGetMeSupport,
  getGetMeSupportQueryKey,
  useGetMeSessions,
  getGetMeSessionsQueryKey,
  useUpdateMeProfile,
  useRemoveMeFavorite,
  useQueueMeAccountDeletion,
  useQueueMeDataExport,
  type MemberFavoriteInputEntityType,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

type SectionId =
  | "menu"
  | "partner"
  | "dashboard"
  | "edit_profile"
  | "favorites"
  | "collections"
  | "reservations"
  | "requests"
  | "orders"
  | "messages"
  | "events"
  | "membership"
  | "reviews"
  | "notifications"
  | "support"
  | "ai_preferences"
  | "settings"
  | "sessions";

type ProfileFavorite = {
  id: string;
  userId: string;
  placeId: string | null;
  entityType: MemberFavoriteInputEntityType;
  entityId: string;
  createdAt: string;
};

function isProfileRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFavoriteEntityType(value: unknown): value is MemberFavoriteInputEntityType {
  return value === "PLACE" || value === "PRODUCT" || value === "EVENT" ||
    value === "ARTICLE" || value === "VIDEO" || value === "ROUTE";
}

function isProfileFavorite(value: unknown): value is ProfileFavorite {
  return isProfileRecord(value) &&
    typeof value.id === "string" && value.id.length > 0 &&
    typeof value.userId === "string" && value.userId.length > 0 &&
    (value.placeId === null || typeof value.placeId === "string") &&
    isFavoriteEntityType(value.entityType) &&
    typeof value.entityId === "string" &&
    typeof value.createdAt === "string";
}

function parseProfileFavorites(value: unknown): ProfileFavorite[] | null {
  if (!isProfileRecord(value) || !isProfileRecord(value.data) ||
      !isProfileRecord(value.meta) || value.error !== null ||
      !Array.isArray(value.data.items)) return null;
  return value.data.items.every(isProfileFavorite) ? value.data.items : null;
}

const SECTIONS: {
  id: SectionId;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
}[] = [
  { id: "partner", icon: "briefcase", title: "Partner Merkezi" },
  { id: "dashboard", icon: "activity", title: "Dashboard" },
  { id: "edit_profile", icon: "user", title: "Profil Bilgileri" },
  { id: "favorites", icon: "heart", title: "Favoriler" },
  { id: "collections", icon: "grid", title: "Koleksiyonlar" },
  { id: "reservations", icon: "calendar", title: "Rezervasyonlar" },
  { id: "requests", icon: "file-text", title: "Talepler" },
  { id: "orders", icon: "shopping-bag", title: "Siparişler" },
  { id: "messages", icon: "message-square", title: "Mesajlar" },
  { id: "events", icon: "star", title: "Etkinliklerim" },
  { id: "membership", icon: "award", title: "Üyelik" },
  { id: "reviews", icon: "edit-3", title: "Değerlendirmeler" },
  { id: "notifications", icon: "bell", title: "Bildirimler & Tercihler" },
  { id: "support", icon: "help-circle", title: "Destek" },
  { id: "ai_preferences", icon: "cpu", title: "AI Hafızası & Tercihler" },
  { id: "sessions", icon: "smartphone", title: "Oturumlar" },
  {
    id: "settings",
    icon: "settings",
    title: "Ayarlar, Sağlayıcılar & Gizlilik",
  },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const { t, isRTL } = useLanguage();

  const [activeSection, setActiveSection] = useState<SectionId>("menu");

  const topInset =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = Platform.OS === "web" ? 24 : (insets.bottom || 0) + 16;

  const handleLogout = async () => {
    await logout();
    router.back();
  };

  const renderSectionHeader = (title: string, onBack: () => void) => (
    <View style={styles.sectionHeader}>
      <Pressable onPress={onBack} hitSlop={10} style={styles.backBtnInside}>
        <Feather
          name={isRTL ? "arrow-right" : "arrow-left"}
          size={20}
          color={colors.foreground}
        />
      </Pressable>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        {title}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.secondary }]}
          accessibilityLabel={t("common.close")}
        >
          <Feather
            name={isRTL ? "arrow-right" : "arrow-left"}
            size={18}
            color={colors.accent}
          />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.aegeanDeep }]}>
            {t("profile.title")}
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            {user ? user.firstName || user.email : t("profile.subtitle")}
          </Text>
        </View>
        <HeartLogo size={32} />
      </View>

      {!user ? (
        <View style={styles.guestContainer}>
          <View
            style={[
              styles.guestIconWrap,
              { backgroundColor: colors.secondary },
            ]}
          >
            <Feather name="user" size={40} color={colors.accent} />
          </View>
          <Text style={[styles.guestTitle, { color: colors.foreground }]}>
            Hesabınıza giriş yapın
          </Text>
          <Text style={[styles.guestSub, { color: colors.mutedForeground }]}>
            Favorilerinizi kaydetmek, rezervasyon yapmak ve AI hafızasından
            faydalanmak için giriş yapın.
          </Text>
          <Pressable
            onPress={login}
            style={[styles.loginBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.loginBtnText}>Giriş Yap</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: bottomInset,
            gap: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {activeSection === "menu" ? (
            <View style={{ gap: 8 }}>
              <View
                style={[
                  styles.passportWrap,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
              >
                <PassportGrid />
              </View>

              <View
                style={[
                  styles.menuList,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
              >
                {SECTIONS.map((sec, idx) => (
                  <Pressable
                    key={sec.id}
                    onPress={() =>
                      sec.id === "partner"
                        ? router.push("/partner")
                        : setActiveSection(sec.id)
                    }
                    style={[
                      styles.menuItem,
                      idx !== SECTIONS.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.menuIcon,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Feather
                        name={sec.icon}
                        size={16}
                        color={colors.accent}
                      />
                    </View>
                    <Text
                      style={[styles.menuText, { color: colors.foreground }]}
                    >
                      {sec.title}
                    </Text>
                    <Feather
                      name={isRTL ? "chevron-left" : "chevron-right"}
                      size={16}
                      color={colors.mutedForeground}
                    />
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={handleLogout}
                style={[
                  styles.logoutBtn,
                  { borderColor: colors.destructive + "40" },
                ]}
              >
                <Feather name="log-out" size={16} color={colors.destructive} />
                <Text
                  style={[styles.logoutText, { color: colors.destructive }]}
                >
                  Çıkış Yap
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {renderSectionHeader(
                SECTIONS.find((s) => s.id === activeSection)?.title || "",
                () => setActiveSection("menu"),
              )}

              {activeSection === "dashboard" && (
                <DashboardSection colors={colors} />
              )}
              {activeSection === "edit_profile" && (
                <ProfileEditSection colors={colors} />
              )}
              {activeSection === "favorites" && (
                <FavoritesSection colors={colors} />
              )}
              {activeSection === "collections" && (
                <CollectionsSection colors={colors} />
              )}
              {activeSection === "reservations" && (
                <ReservationsSection colors={colors} />
              )}
              {activeSection === "requests" && (
                <RequestsSection colors={colors} />
              )}

              {/* Not configured sections */}
              {[
                "orders",
                "messages",
                "events",
                "membership",
                "reviews",
              ].includes(activeSection) && (
                <NotConfiguredState
                  colors={colors}
                  title={SECTIONS.find((s) => s.id === activeSection)?.title}
                />
              )}

              {activeSection === "notifications" && (
                <NotificationsSection colors={colors} />
              )}
              {activeSection === "support" && (
                <SupportSection colors={colors} />
              )}
              {activeSection === "ai_preferences" && (
                <AiPreferencesSection colors={colors} />
              )}
              {activeSection === "sessions" && (
                <SessionsSection colors={colors} />
              )}
              {activeSection === "settings" && (
                <SettingsSection colors={colors} />
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// --- Sections ---

function DashboardSection({ colors }: { colors: any }) {
  const { user } = useAuth();
  const { data, isLoading, isError } = useGetMeDashboard({
    query: { queryKey: [...getGetMeDashboardQueryKey(), user?.id] },
  });
  if (isLoading) return <LoadingState colors={colors} />;
  if (isError) return <ErrorState colors={colors} />;

  const stats = (data?.data?.stats as any) || {};

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.statsRow}>
        <StatBox
          label="Favoriler"
          value={stats.favoriteCount ?? "-"}
          icon="heart"
          color={colors.coral}
          colors={colors}
        />
        <StatBox
          label="Rezervasyon"
          value={stats.reservationCount ?? "-"}
          icon="calendar"
          color={colors.aegean}
          colors={colors}
        />
        <StatBox
          label="Puan"
          value={stats.averageRating ?? "-"}
          icon="star"
          color={colors.olive}
          colors={colors}
        />
      </View>
    </View>
  );
}

function ProfileEditSection({ colors }: { colors: any }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetMe({
    query: { queryKey: [...getGetMeQueryKey(), user?.id] },
  });

  const update = useUpdateMeProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [...getGetMeQueryKey(), user?.id],
        });
        Alert.alert("Başarılı", "Profiliniz güncellendi.");
      },
      onError: () => Alert.alert("Hata", "Profil güncellenemedi."),
    },
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (data?.data) {
      const profile = (data?.data?.profile as any) || {};
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setBio(profile.bio || "");
    }
  }, [data]);

  if (isLoading) return <LoadingState colors={colors} />;

  const handleSave = () => {
    update.mutate({ data: { firstName, lastName, bio } });
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.label, { color: colors.foreground }]}>Ad</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.foreground,
          },
        ]}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={[styles.label, { color: colors.foreground }]}>Soyad</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.foreground,
          },
        ]}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={[styles.label, { color: colors.foreground }]}>
        Hakkımda (Bio)
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.foreground,
            minHeight: 80,
            textAlignVertical: "top",
          },
        ]}
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <Pressable
        onPress={handleSave}
        disabled={update.isPending}
        style={[
          styles.primaryBtn,
          {
            backgroundColor: colors.accent,
            opacity: update.isPending ? 0.7 : 1,
          },
        ]}
      >
        <Text style={styles.primaryBtnText}>
          {update.isPending ? "Kaydediliyor..." : "Kaydet"}
        </Text>
      </Pressable>
    </View>
  );
}

function FavoritesSection({ colors }: { colors: any }) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetMeFavorites({
    query: { queryKey: [...getGetMeFavoritesQueryKey(), user?.id] },
  });
  const remove = useRemoveMeFavorite({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [...getGetMeFavoritesQueryKey(), user?.id],
        });
      },
    },
  });
  const parsedFavorites =
    data === undefined ? undefined : parseProfileFavorites(data);
  const favorites = parsedFavorites ?? [];
  const malformed = data !== undefined && parsedFavorites === null;

  if (isLoading) return <LoadingState colors={colors} />;
  if (malformed)
    return <EmptyState colors={colors} message="Favori verisi doğrulanamadı." />;
  if (favorites.length === 0)
    return <EmptyState colors={colors} message="Favoriniz bulunmuyor." />;

  return (
    <View style={[styles.sectionContainer, { gap: 10 }]}>
      {favorites.map((fav) => (
        <View
          key={fav.id}
          style={[
            styles.itemCard,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Pressable onPress={() => {
              if (fav.entityType === "PRODUCT" && fav.entityId.trim().length > 0) {
                router.push({
                  pathname: "/product/[productId]",
                  params: { productId: fav.entityId },
                });
              }
            }}>
              <Text style={[styles.itemTitle, { color: colors.foreground }]}>
                {fav.entityId || "İsimsiz"}
              </Text>
              <Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>
                {fav.entityType === "PRODUCT" ? "Ürün / Pazar" : fav.entityType}
              </Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => {
              if (fav.entityId.trim().length > 0) {
                remove.mutate({
                  data: { entityId: fav.entityId, entityType: fav.entityType },
                });
              }
            }}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Feather name="trash-2" size={16} color={colors.destructive} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

function CollectionsSection({ colors }: { colors: any }) {
  const { user } = useAuth();
  const { data, isLoading } = useGetMeCollections({
    query: { queryKey: [...getGetMeCollectionsQueryKey(), user?.id] },
  });
  const collections = (data?.data?.items as any[]) || [];

  if (isLoading) return <LoadingState colors={colors} />;
  if (collections.length === 0)
    return <EmptyState colors={colors} message="Koleksiyonunuz bulunmuyor." />;

  return (
    <View style={[styles.sectionContainer, { gap: 10 }]}>
      {collections.map((c, i) => (
        <View
          key={i}
          style={[
            styles.itemCard,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.itemTitle, { color: colors.foreground }]}>
            {c.name}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ReservationsSection({ colors }: { colors: any }) {
  const { user } = useAuth();
  const { data, isLoading } = useGetMeReservations({
    query: { queryKey: [...getGetMeReservationsQueryKey(), user?.id] },
  });
  const list = (data?.data?.items as any[]) || [];
  if (isLoading) return <LoadingState colors={colors} />;
  if (list.length === 0)
    return (
      <EmptyState
        colors={colors}
        message="Geçmiş rezervasyonunuz bulunmuyor."
      />
    );
  return (
    <View style={styles.sectionContainer}>
      <Text style={{ color: colors.foreground }}>Liste: {list.length}</Text>
    </View>
  );
}

function RequestsSection({ colors }: { colors: any }) {
  const { user } = useAuth();
  const { data, isLoading } = useGetMeRequests({
    query: { queryKey: [...getGetMeRequestsQueryKey(), user?.id] },
  });
  const list = (data?.data?.items as any[]) || [];
  if (isLoading) return <LoadingState colors={colors} />;
  if (list.length === 0)
    return <EmptyState colors={colors} message="Aktif talebiniz bulunmuyor." />;
  return (
    <View style={styles.sectionContainer}>
      <Text style={{ color: colors.foreground }}>Liste: {list.length}</Text>
    </View>
  );
}

function NotificationsSection({ colors }: { colors: any }) {
  const { user } = useAuth();
  const { data, isLoading } = useGetMeNotificationPreferences({
    query: {
      queryKey: [...getGetMeNotificationPreferencesQueryKey(), user?.id],
    },
  });
  const preferences = (data?.data?.items as any[]) || [];
  const providers = (data?.data?.deliveryProviders as string[]) || [];

  if (isLoading) return <LoadingState colors={colors} />;
  if (preferences.length === 0)
    return (
      <EmptyState colors={colors} message="Bildirim tercihi bulunmuyor." />
    );

  return (
    <View style={[styles.sectionContainer, { gap: 10 }]}>
      {preferences.map((p, i) => {
        const notConfigured = !providers.includes(p.channel);
        return (
          <View
            key={i}
            style={[
              styles.itemCard,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
                opacity: notConfigured ? 0.6 : 1,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: colors.foreground }]}>
                {p.purpose || "Bilinmeyen Amaç"}
              </Text>
              <Text
                style={[styles.itemMeta, { color: colors.mutedForeground }]}
              >
                {p.channel} {notConfigured ? "(Yapılandırılmadı)" : ""}
              </Text>
            </View>
            {!notConfigured && (
              <Feather
                name={p.enabled ? "check-circle" : "circle"}
                size={20}
                color={p.enabled ? colors.accent : colors.mutedForeground}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

function SupportSection({ colors }: { colors: any }) {
  const { user } = useAuth();
  const { data, isLoading } = useGetMeSupport({
    query: { queryKey: [...getGetMeSupportQueryKey(), user?.id] },
  });
  const list = (data?.data?.cases as any[]) || [];
  if (isLoading) return <LoadingState colors={colors} />;
  if (list.length === 0)
    return (
      <EmptyState colors={colors} message="Destek talebiniz bulunmuyor." />
    );
  return (
    <View style={styles.sectionContainer}>
      <Text style={{ color: colors.foreground }}>Talepler: {list.length}</Text>
    </View>
  );
}

function AiPreferencesSection({ colors }: { colors: any }) {
  return (
    <View style={[styles.sectionContainer, { gap: 16 }]}>
      <AiBrainControls />
    </View>
  );
}

function SessionsSection({ colors }: { colors: any }) {
  const { user } = useAuth();
  const { data, isLoading } = useGetMeSessions({
    query: { queryKey: [...getGetMeSessionsQueryKey(), user?.id] },
  });
  const list = (data?.data?.sessions as any[]) || [];

  if (isLoading) return <LoadingState colors={colors} />;
  if (list.length === 0)
    return <EmptyState colors={colors} message="Kayıtlı oturum bulunmuyor." />;

  return (
    <View style={[styles.sectionContainer, { gap: 10 }]}>
      {list.map((s, i) => (
        <View
          key={i}
          style={[
            styles.itemCard,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
          testID="session-card"
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.itemTitle, { color: colors.foreground }]}>
              {s.current ? "Mevcut Oturum" : "Diğer Oturum"}
            </Text>
            <Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>
              {s.provider || "Bilinmeyen Sağlayıcı"} •{" "}
              {s.authenticated ? "Doğrulandı" : "Doğrulanmadı"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function SettingsSection({ colors }: { colors: any }) {
  const exportData = useQueueMeDataExport();
  const deleteAcc = useQueueMeAccountDeletion();
  const { language, setLanguage } = useLanguage();
  const { t } = useLanguage();

  const handleDelete = () => {
    if (Platform.OS === "web") {
      if (
        window.confirm(
          "Hesabınız ve tüm verileriniz kalıcı olarak silinecektir. Onaylıyor musunuz?",
        )
      ) {
        deleteAcc.mutate();
        Alert.alert("İşleme Alındı", "Hesap silme talebiniz sıraya alındı.");
      }
    } else {
      Alert.alert(
        "Hesabı Sil",
        "Hesabınız ve tüm verileriniz kalıcı olarak silinecektir. Onaylıyor musunuz?",
        [
          { text: "İptal", style: "cancel" },
          {
            text: "Sil",
            style: "destructive",
            onPress: () => {
              deleteAcc.mutate();
              Alert.alert(
                "İşleme Alındı",
                "Hesap silme talebiniz sıraya alındı.",
              );
            },
          },
        ],
      );
    }
  };

  return (
    <View style={[styles.sectionContainer, { gap: 24 }]}>
      <IntegrationStatusCard />

      <View style={{ gap: 12 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Dil
        </Text>
        <View style={styles.langGrid}>
          {SUPPORTED_LANGUAGES.map((l) => {
            const active = l.code === language;
            return (
              <Pressable
                key={l.code}
                onPress={() => setLanguage(l.code)}
                style={[
                  styles.langChip,
                  {
                    backgroundColor: active ? colors.accent : colors.secondary,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text style={styles.flag}>{l.flag}</Text>
                <Text
                  style={[
                    styles.langLabel,
                    { color: active ? "#fff" : colors.foreground },
                  ]}
                >
                  {l.nativeName}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 12, marginTop: 16 }}>
        <Text style={[styles.sectionTitle, { color: colors.destructive }]}>
          Tehlikeli Alan
        </Text>
        <Pressable
          testID="data-export-btn"
          onPress={() => {
            exportData.mutate();
            Alert.alert(
              "İşleme Alındı",
              "Veri dışa aktarma talebiniz sıraya alındı.",
            );
          }}
          style={[styles.outlineBtn, { borderColor: colors.border }]}
        >
          <Feather name="download" size={16} color={colors.foreground} />
          <Text style={[styles.outlineBtnText, { color: colors.foreground }]}>
            Verilerimi Dışa Aktar
          </Text>
        </Pressable>

        <Pressable
          testID="delete-account-btn"
          onPress={handleDelete}
          style={[styles.outlineBtn, { borderColor: colors.destructive }]}
        >
          <Feather name="trash-2" size={16} color={colors.destructive} />
          <Text style={[styles.outlineBtnText, { color: colors.destructive }]}>
            Hesabımı Sil
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function NotConfiguredState({
  colors,
  title,
}: {
  colors: any;
  title?: string;
}) {
  return (
    <View
      style={[
        styles.notConfigured,
        { borderColor: colors.border, backgroundColor: colors.card },
      ]}
    >
      <Feather name="clock" size={24} color={colors.mutedForeground} />
      <Text style={[styles.notConfTitle, { color: colors.foreground }]}>
        {title}
      </Text>
      <Text style={[styles.notConfSub, { color: colors.mutedForeground }]}>
        Bu özellik şu anda hesabınız için yapılandırılmamıştır veya aktif
        değildir.
      </Text>
    </View>
  );
}

function LoadingState({ colors }: { colors: any }) {
  return (
    <View style={{ padding: 40, alignItems: "center" }}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

function ErrorState({ colors }: { colors: any }) {
  return (
    <View style={{ padding: 40, alignItems: "center" }}>
      <Text
        style={{ color: colors.destructive, fontFamily: "Inter_500Medium" }}
      >
        Veri yüklenirken hata oluştu.
      </Text>
    </View>
  );
}

function EmptyState({ colors, message }: { colors: any; message: string }) {
  return (
    <View style={{ padding: 40, alignItems: "center" }}>
      <Text
        style={{
          color: colors.mutedForeground,
          fontFamily: "Inter_400Regular",
          textAlign: "center",
        }}
      >
        {message}
      </Text>
    </View>
  );
}

function StatBox({ label, value, icon, color, colors }: any) {
  return (
    <View
      style={[
        styles.stat,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color + "22" }]}>
        <Feather name={icon} size={14} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: "Poppins_700Bold", fontSize: 22 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },

  guestContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  guestIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  guestTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    textAlign: "center",
  },
  guestSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  loginBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 99,
    marginTop: 8,
  },
  loginBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },

  passportWrap: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 2,
    overflow: "hidden",
  },

  menuList: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15 },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  logoutText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  backBtnInside: { padding: 8, marginLeft: -8 },
  sectionTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 18 },
  sectionContainer: { gap: 16 },

  statsRow: { flexDirection: "row", gap: 10 },
  stat: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontFamily: "Poppins_700Bold", fontSize: 18 },
  statLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textTransform: "uppercase",
  },

  label: { fontFamily: "Inter_500Medium", fontSize: 13, marginBottom: -8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },

  primaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  itemTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 15 },
  itemMeta: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
  iconBtn: { padding: 8 },

  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  outlineBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },

  notConfigured: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    borderStyle: "dashed",
    gap: 12,
  },
  notConfTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  notConfSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },

  langGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  langChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 99,
    borderWidth: 1,
  },
  flag: { fontSize: 16 },
  langLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
});
