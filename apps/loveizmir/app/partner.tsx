import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeartLogo } from "@/components/HeartLogo";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/lib/auth";
import {
  getGetPartnerMeQueryKey,
  getListPartnerClaimsQueryKey,
  useGetPartnerMe,
  useJoinPartner,
  useListPartnerClaims,
  type PartnerAccount,
  type PartnerClaim,
  type PartnerMeEnvelopeData,
} from "@workspace/api-client-react";

type Colors = ReturnType<typeof useColors>;

const STATUS_LABELS: Record<PartnerAccount["status"], string> = {
  DRAFT: "Taslak",
  ONBOARDING: "Başvuru hazırlanıyor",
  PENDING_REVIEW: "İncelemede",
  ACTIVE: "Aktif",
  RESTRICTED: "Kısıtlı",
  SUSPENDED: "Askıya alındı",
  REJECTED: "Reddedildi",
};

const CLAIM_LABELS: Record<PartnerClaim["status"], string> = {
  UNCLAIMED: "Henüz talep edilmedi",
  CLAIM_REQUESTED: "İşletme sahipliği talep edildi",
  EVIDENCE_REQUIRED: "Kanıt gerekli",
  UNDER_REVIEW: "İncelemede",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  REVOKED: "Geri alındı",
};

export default function PartnerScreen() {
  const { user, isLoading } = useAuth();
  return (
    <PartnerSubject
      key={user?.id ?? "guest"}
      userId={user?.id}
      authLoading={isLoading}
    />
  );
}

function PartnerSubject({
  userId,
  authLoading,
}: {
  userId?: string;
  authLoading: boolean;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const subjectKey = userId ?? "guest";
  const partnerKey = [...getGetPartnerMeQueryKey(), subjectKey] as const;
  const claimsKey = [...getListPartnerClaimsQueryKey(), subjectKey] as const;

  const partner = useGetPartnerMe({
    query: {
      queryKey: partnerKey,
      enabled: Boolean(userId),
    },
  });
  const account = partner.data?.data.account ?? null;
  const claims = useListPartnerClaims({
    query: {
      queryKey: claimsKey,
      enabled: Boolean(userId && account),
    },
  });
  const join = useJoinPartner({
    mutation: {
      mutationKey: ["joinPartner", subjectKey],
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: partnerKey });
      },
    },
  });

  const joinKey = `mobile-partner-join-v1:${subjectKey}`;
  const goBack = () => router.back();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Geri"
          hitSlop={10}
          style={[styles.backButton, { backgroundColor: colors.secondary }]}
        >
          <Feather name="arrow-left" size={19} color={colors.accent} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: colors.aegeanDeep }]}>
            Partner Merkezi
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            İşletme durumunuz ve başvurunuz
          </Text>
        </View>
        <HeartLogo size={32} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {authLoading ? (
          <StateCard
            colors={colors}
            icon="loader"
            title="Hesabınız kontrol ediliyor"
            detail="Lütfen bekleyin."
            loading
          />
        ) : !userId ? (
          <StateCard
            colors={colors}
            icon="lock"
            title="Giriş yapmanız gerekiyor"
            detail="Partner Merkezi yalnızca Loveİzmir hesabıyla giriş yapan üyelere açıktır. Profil ekranından giriş yapabilirsiniz."
          />
        ) : partner.isLoading ? (
          <StateCard
            colors={colors}
            icon="loader"
            title="Partner bilgileriniz yükleniyor"
            detail="Güncel durumunuz getiriliyor."
            loading
          />
        ) : partner.isError ? (
          <StateCard
            colors={colors}
            icon="alert-circle"
            title="Partner bilgileri yüklenemedi"
            detail="Bağlantınızı kontrol edip yeniden deneyin."
            actionLabel="Yeniden dene"
            onAction={() => partner.refetch()}
          />
        ) : !account ? (
          <JoinCard
            colors={colors}
            pending={join.isPending}
            error={join.isError}
            onJoin={() =>
              join.mutate({
                headers: { "Idempotency-Key": joinKey },
              })
            }
          />
        ) : (
          <AccountContent
            colors={colors}
            data={partner.data!.data}
            account={account}
            claims={claims.data?.data.items ?? []}
            claimsLoading={claims.isLoading}
            claimsError={claims.isError}
            retryClaims={() => claims.refetch()}
          />
        )}
      </ScrollView>
    </View>
  );
}

function JoinCard({
  colors,
  pending,
  error,
  onJoin,
}: {
  colors: Colors;
  pending: boolean;
  error: boolean;
  onJoin: () => void;
}) {
  return (
    <View style={[styles.hero, { backgroundColor: colors.aegeanDeep }]}>
      <View style={styles.heroIcon}>
        <Feather name="briefcase" size={26} color="#fff" />
      </View>
      <Text style={styles.heroTitle}>Loveİzmir ile partner olun</Text>
      <Text style={styles.heroText}>
        Mevcut Loveİzmir hesabınız partner hesabınız için de kullanılır. İkinci
        bir giriş veya ayrı bir yerel partner profili oluşturulmaz.
      </Text>
      {error ? (
        <Text style={styles.heroError} accessibilityRole="alert">
          Partner hesabı başlatılamadı. Lütfen yeniden deneyin.
        </Text>
      ) : null}
      <Pressable
        onPress={onJoin}
        disabled={pending}
        accessibilityRole="button"
        accessibilityLabel="Partner ol"
        accessibilityState={{ disabled: pending, busy: pending }}
        style={[
          styles.primaryButton,
          { backgroundColor: colors.accent, opacity: pending ? 0.65 : 1 },
        ]}
      >
        {pending ? <ActivityIndicator color="#fff" size="small" /> : null}
        <Text style={styles.primaryButtonText}>
          {pending ? "Başlatılıyor…" : "Partner Ol"}
        </Text>
      </Pressable>
    </View>
  );
}

function AccountContent({
  colors,
  data,
  account,
  claims,
  claimsLoading,
  claimsError,
  retryClaims,
}: {
  colors: Colors;
  data: PartnerMeEnvelopeData;
  account: PartnerAccount;
  claims: PartnerClaim[];
  claimsLoading: boolean;
  claimsError: boolean;
  retryClaims: () => void;
}) {
  const locked = ["RESTRICTED", "SUSPENDED", "REJECTED"].includes(
    account.status,
  );
  const onboarding =
    account.status === "DRAFT" || account.status === "ONBOARDING";

  return (
    <View style={styles.stack}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.statusRow}>
          <View
            style={[styles.statusIcon, { backgroundColor: colors.secondary }]}
          >
            <Feather
              name={
                locked
                  ? "slash"
                  : account.status === "ACTIVE"
                    ? "check-circle"
                    : "clock"
              }
              size={20}
              color={locked ? colors.destructive : colors.accent}
            />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
              PARTNER DURUMU
            </Text>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {STATUS_LABELS[account.status]}
            </Text>
          </View>
        </View>
        {account.partnerName ? (
          <Text style={[styles.partnerName, { color: colors.foreground }]}>
            {account.partnerName}
          </Text>
        ) : null}
        {account.adminReason ? (
          <InfoLine
            colors={colors}
            label="Yönetici açıklaması"
            value={account.adminReason}
            danger={locked}
          />
        ) : null}
        {locked ? (
          <Text style={[styles.notice, { color: colors.destructive }]}>
            Bu durumda partner değişiklikleri kullanılamaz.
          </Text>
        ) : null}
      </View>

      {onboarding ? <OnboardingCard colors={colors} account={account} /> : null}

      {account.status === "PENDING_REVIEW" ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Yönetici incelemesi
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Başvurunuz yönetici incelemesinde. Aşağıdaki sahiplik ve kanıt
            durumları güncel API verisidir.
          </Text>
        </View>
      ) : null}

      {account.status === "ACTIVE" ? (
        <ActiveOverview colors={colors} data={data} />
      ) : null}

      <ClaimsCard
        colors={colors}
        claims={claims}
        loading={claimsLoading}
        error={claimsError}
        retry={retryClaims}
      />
    </View>
  );
}

function OnboardingCard({
  colors,
  account,
}: {
  colors: Colors;
  account: PartnerAccount;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.foreground }]}>
        Başvuru ilerlemesi
      </Text>
      <InfoLine
        colors={colors}
        label="Mevcut adım"
        value={account.currentStep}
      />
      <Text style={[styles.progressText, { color: colors.accent }]}>
        {account.completedSteps.length} adım tamamlandı
      </Text>
      {account.completedSteps.length ? (
        <View style={styles.steps}>
          {account.completedSteps.map((step) => (
            <View key={step} style={styles.step}>
              <Feather name="check-circle" size={15} color={colors.accent} />
              <Text style={[styles.stepText, { color: colors.foreground }]}>
                {step}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.body, { color: colors.mutedForeground }]}>
          Henüz tamamlanan bir adım yok.
        </Text>
      )}
      <View style={[styles.webNotice, { backgroundColor: colors.secondary }]}>
        <Feather name="monitor" size={18} color={colors.accent} />
        <Text style={[styles.webNoticeText, { color: colors.foreground }]}>
          Web partner panelinden devam edin
        </Text>
      </View>
    </View>
  );
}

function ActiveOverview({
  colors,
  data,
}: {
  colors: Colors;
  data: PartnerMeEnvelopeData;
}) {
  const countItems: [string, number | null][] = [
    ["İşletmeler", data.counts.businesses],
    ["Kampanyalar", data.counts.campaigns],
    ["Talepler", data.counts.leads],
    ["Ürünler", data.counts.products],
    ["Rezervasyon talepleri", data.counts.reservationRequests],
    ["Mesajlar", data.counts.messages],
    ["Profil görüntüleme", data.counts.profileViews],
  ];
  const providers: [string, string][] = [
    ["Plan", data.providers.plan],
    ["Doğrulama", data.providers.verification],
    ["Kanıt depolama", data.providers.evidenceStorage],
  ];

  return (
    <>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Yönetilen işletmeler
        </Text>
        {data.businesses.length ? (
          data.businesses.map((business) => (
            <View
              key={business.id}
              style={[styles.business, { borderTopColor: colors.border }]}
            >
              <View style={styles.flex}>
                <Text
                  style={[styles.businessName, { color: colors.foreground }]}
                >
                  {business.name}
                </Text>
                <Text style={[styles.body, { color: colors.mutedForeground }]}>
                  {business.category} · {business.role}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Yönetilen işletme bulunmuyor.
          </Text>
        )}
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Panel özeti
        </Text>
        <View style={styles.countGrid}>
          {countItems.map(([label, value]) => (
            <View
              key={label}
              style={[styles.countBox, { backgroundColor: colors.secondary }]}
            >
              <Text style={[styles.countValue, { color: colors.foreground }]}>
                {value == null ? "Kullanılamıyor" : value}
              </Text>
              <Text
                style={[styles.countLabel, { color: colors.mutedForeground }]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[styles.subheading, { color: colors.foreground }]}>
          Sağlayıcı yetenekleri
        </Text>
        {providers.map(([label, value]) => (
          <InfoLine
            key={label}
            colors={colors}
            label={label}
            value={
              !value || value === "NOT_CONFIGURED" ? "Kullanılamıyor" : value
            }
          />
        ))}
      </View>
    </>
  );
}

function ClaimsCard({
  colors,
  claims,
  loading,
  error,
  retry,
}: {
  colors: Colors;
  claims: PartnerClaim[];
  loading: boolean;
  error: boolean;
  retry: () => void;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.foreground }]}>
        İşletme sahipliği ve kanıtlar
      </Text>
      {loading ? (
        <ActivityIndicator
          accessibilityLabel="Sahiplik talepleri yükleniyor"
          color={colors.accent}
        />
      ) : error ? (
        <>
          <Text
            accessibilityRole="alert"
            style={[styles.body, { color: colors.destructive }]}
          >
            Sahiplik talepleri yüklenemedi.
          </Text>
          <Pressable accessibilityRole="button" onPress={retry}>
            <Text style={[styles.retry, { color: colors.accent }]}>
              Yeniden dene
            </Text>
          </Pressable>
        </>
      ) : claims.length === 0 ? (
        <Text style={[styles.body, { color: colors.mutedForeground }]}>
          Henüz bir sahiplik talebi bulunmuyor.
        </Text>
      ) : (
        claims.map((claim) => (
          <View
            key={claim.id}
            style={[styles.claim, { borderTopColor: colors.border }]}
          >
            <Text style={[styles.businessName, { color: colors.foreground }]}>
              {claim.businessName ?? "İşletme"}
            </Text>
            <Text style={[styles.body, { color: colors.mutedForeground }]}>
              {CLAIM_LABELS[claim.status]}
            </Text>
            {claim.evidenceRequired ? (
              <Text style={[styles.notice, { color: colors.accent }]}>
                Kanıt gerekli. Mobil uygulamada dosya yükleme sunulmuyor.
              </Text>
            ) : (
              <Text style={[styles.body, { color: colors.mutedForeground }]}>
                Ek kanıt gerekmiyor.
              </Text>
            )}
            {claim.requestInfo ? (
              <InfoLine
                colors={colors}
                label="İstenen bilgi"
                value={claim.requestInfo}
              />
            ) : null}
            {claim.adminReason ? (
              <InfoLine
                colors={colors}
                label="Yönetici açıklaması"
                value={claim.adminReason}
              />
            ) : null}
          </View>
        ))
      )}
    </View>
  );
}

function InfoLine({
  colors,
  label,
  value,
  danger,
}: {
  colors: Colors;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <View style={styles.infoLine}>
      <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.infoValue,
          { color: danger ? colors.destructive : colors.foreground },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function StateCard({
  colors,
  icon,
  title,
  detail,
  loading,
  actionLabel,
  onAction,
}: {
  colors: Colors;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  detail: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View
      style={[
        styles.stateCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      accessibilityLiveRegion="polite"
    >
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} />
      ) : (
        <Feather name={icon} size={36} color={colors.accent} />
      )}
      <Text style={[styles.stateTitle, { color: colors.foreground }]}>
        {title}
      </Text>
      <Text style={[styles.stateDetail, { color: colors.mutedForeground }]}>
        {detail}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={[styles.secondaryButton, { borderColor: colors.accent }]}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.accent }]}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  backButton: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  headerCopy: { flex: 1 },
  title: { fontFamily: "Poppins_700Bold", fontSize: 23, letterSpacing: -0.5 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 1 },
  content: { paddingHorizontal: 20 },
  stack: { gap: 14 },
  card: { borderRadius: 18, borderWidth: 1, gap: 12, padding: 18 },
  hero: { borderRadius: 22, padding: 24 },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginBottom: 18,
    width: 48,
  },
  heroTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    marginBottom: 8,
  },
  heroText: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  heroError: {
    color: "#FFD6D6",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    marginTop: 12,
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 20,
    minHeight: 48,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  statusRow: { alignItems: "center", flexDirection: "row", gap: 12 },
  statusIcon: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  flex: { flex: 1 },
  eyebrow: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
  },
  cardTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 18 },
  partnerName: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  body: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 19 },
  notice: { fontFamily: "Inter_600SemiBold", fontSize: 12, lineHeight: 18 },
  progressText: { fontFamily: "Inter_700Bold", fontSize: 13 },
  steps: { gap: 8 },
  step: { alignItems: "center", flexDirection: "row", gap: 8 },
  stepText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 13 },
  webNotice: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
    padding: 14,
  },
  webNoticeText: { flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 13 },
  business: { borderTopWidth: 1, flexDirection: "row", paddingTop: 12 },
  businessName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  countGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  countBox: { borderRadius: 12, minHeight: 78, padding: 11, width: "48%" },
  countValue: { fontFamily: "Inter_700Bold", fontSize: 16 },
  countLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 5,
  },
  subheading: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    marginTop: 6,
  },
  claim: { borderTopWidth: 1, gap: 6, paddingTop: 12 },
  infoLine: { gap: 3 },
  infoLabel: { fontFamily: "Inter_500Medium", fontSize: 11 },
  infoValue: { fontFamily: "Inter_500Medium", fontSize: 13, lineHeight: 18 },
  retry: { fontFamily: "Inter_700Bold", fontSize: 13 },
  stateCard: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 30,
  },
  stateTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    textAlign: "center",
  },
  stateDetail: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  secondaryButtonText: { fontFamily: "Inter_700Bold", fontSize: 13 },
});
