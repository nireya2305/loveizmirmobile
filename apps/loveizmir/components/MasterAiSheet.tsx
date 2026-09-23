import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeartLogo } from "@/components/HeartLogo";
import { useMasterAi, type MasterMsg } from "@/contexts/MasterAiContext";
import { type LoveIzmirAction } from "@/lib/loveizmirApi";
import { useColors } from "@/hooks/useColors";
import { } from "@workspace/api-client-react";

type QuickAction = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  prompt: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    key: "q1",
    label: "Bugün İzmir’de ne yapabilirim?",
    icon: "compass",
    prompt: "Bugün İzmir’de ne yapabilirim?",
  },
  {
    key: "q2",
    label: "Urla’da güzel bir rota hazırla",
    icon: "map",
    prompt: "Urla’da güzel bir rota hazırla",
  },
  {
    key: "q3",
    label: "Çeşme’de nereleri gezmeliyim?",
    icon: "navigation",
    prompt: "Çeşme’de nereleri gezmeliyim?",
  },
  {
    key: "q4",
    label: "Bu hafta hangi etkinlikler var?",
    icon: "calendar",
    prompt: "Bu hafta hangi etkinlikler var?",
  },
  {
    key: "q5",
    label: "Yakınımdaki restoranları göster",
    icon: "coffee",
    prompt: "Yakınımdaki restoranları göster",
  }
];

export function MasterAiSheet() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    isOpen,
    close,
    messages,
    loading,
    send,
    clear,
    suggestions,
    personalization,
    responseState,
    canSend,
    widgetStatusLoading: isStatusLoading,
    widgetStatusError: isStatusError,
  } = useMasterAi();
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<MasterMsg>>(null);

  const showLoading = isOpen && isStatusLoading;
  const showUnavailable =
    isOpen && !showLoading &&
    (!canSend || isStatusError || responseState === "unavailable");

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 80);
    }
  }, [messages.length, loading]);

  const onSend = useCallback(
    async (text: string) => {
      if (!canSend) return;
      const t = text.trim();
      if (!t) return;
      setInput("");
      if (Platform.OS !== "web") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await send(t);
    },
    [send, canSend],
  );

  const onNavigate = useCallback(
    async (action: LoveIzmirAction) => {
      try {
        if (action.type === "OPEN_PAGE") {
          const safePath = action.target.startsWith("/")
            ? action.target
            : "/" + action.target;
          close();
          router.push(safePath as never);
        } else if (action.type === "OPEN_MAP") {
          const q = encodeURIComponent(action.target);
          await Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${q}`,
          );
        } else if (action.type === "PREPARE_WHATSAPP") {
          const num = action.target.replace(/\D/g, "");
          if (num) await Linking.openURL(`https://wa.me/${num}`);
        }
      } catch {
        // ignore invalid routes
      }
    },
    [close, router],
  );

  const renderItem = useCallback(
    ({ item }: { item: MasterMsg }) => {
      const isUser = item.role === "user";
      return (
        <View
          style={[
            styles.bubbleWrap,
            { alignItems: isUser ? "flex-end" : "flex-start" },
          ]}
        >
          {!isUser && (
            <View style={styles.aiHeader}>
              <View
                style={[
                  styles.aiAvatar,
                  { backgroundColor: colors.aegeanDeep },
                ]}
              >
                <HeartLogo size={12} />
              </View>
              <Text style={[styles.aiName, { color: colors.mutedForeground }]}>
                Loveİzmir AI
              </Text>
            </View>
          )}
          <View
            style={[
              styles.bubble,
              isUser
                ? { backgroundColor: colors.accent }
                : {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                { color: isUser ? "#fff" : colors.foreground },
              ]}
            >
              {item.content}
            </Text>
          </View>
          {!isUser && item.actions && item.actions.length > 0 && (
            <View style={styles.actionsRow}>
              {item.actions.map((a, i) => (
                <Pressable
                  key={`${a.type}-${i}`}
                  onPress={() => onNavigate(a)}
                  style={[
                    styles.actionChip,
                    {
                      backgroundColor: colors.aegeanDeep,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={a.label}
                >
                  <Feather name="arrow-up-right" size={13} color={"#fff"} />
                  <Text style={styles.actionChipText}>{a.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      );
    },
    [colors, onNavigate],
  );

  const topInset =
    Platform.OS === "web" ? Math.max(insets.top, 12) : insets.top;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={close}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingTop: topInset + 8,
            },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View
                  style={[
                    styles.headerAvatar,
                    { backgroundColor: colors.aegeanDeep },
                  ]}
                >
                  <HeartLogo size={18} />
                </View>
                <View>
                  <Text
                    style={[styles.headerTitle, { color: colors.foreground }]}
                  >
                    Loveİzmir AI
                  </Text>
                  <Text
                    style={[
                      styles.headerSub,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    İzmir’i keşfetmek için bana sor.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={close}
                accessibilityRole="button"
                accessibilityLabel="Kapat"
                style={[
                  styles.iconBtn,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Feather name="x" size={18} color={colors.foreground} />
              </Pressable>
            </View>

            {showLoading ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: colors.mutedForeground }}>
                  Loveİzmir AI bağlanıyor…
                </Text>
              </View>
            ) : showUnavailable ? (
              <View style={{ flex: 1, padding: 20 }}>
                <View style={[styles.welcomeCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                  <HeartLogo size={28} />
                  <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>
                    Sistem Hazırlanıyor
                  </Text>
                  <Text style={[styles.welcomeText, { color: colors.mutedForeground }]}>
                    Loveİzmir AI bağlantısı şu anda hazırlanıyor. Keşfet ve Rehber bölümlerini kullanmaya devam edebilirsin.
                  </Text>
                </View>
              </View>
            ) : messages.length === 0 ? (
              <ScrollView
                contentContainerStyle={{ padding: 20, gap: 14 }}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={[
                    styles.welcomeCard,
                    { backgroundColor: colors.aegeanDeep },
                  ]}
                >
                  <HeartLogo size={28} />
                  <Text style={styles.welcomeTitle}>
                    Loveİzmir AI
                  </Text>
                  <Text style={styles.welcomeText}>
                    İzmir'i keşfetmek için bana sor.
                  </Text>
                </View>

                <Text
                  style={[
                    styles.suggestionsTitle,
                    { color: colors.mutedForeground },
                  ]}
                >
                  HIZLI EYLEMLER
                </Text>
                <View style={styles.quickGrid}>
                  {QUICK_ACTIONS.map((q) => (
                    <Pressable
                      key={q.key}
                      onPress={() => void onSend(q.prompt)}
                      style={[
                        styles.quickItem,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={q.label}
                    >
                      <View
                        style={[
                          styles.quickIconWrap,
                          { backgroundColor: colors.secondary },
                        ]}
                      >
                        <Feather
                          name={q.icon}
                          size={16}
                          color={colors.accent}
                        />
                      </View>
                      <Text
                        style={[
                          styles.quickLabel,
                          { color: colors.foreground },
                        ]}
                        numberOfLines={2}
                      >
                        {q.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View style={{ flex: 1 }}>
                {responseState === "degraded" && (
                  <View style={[styles.degradedBanner, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                    <Feather name="alert-circle" size={16} color={colors.accent} />
                    <Text style={[styles.degradedText, { color: colors.foreground }]}>
                      Sınırlı yanıt modu: Birincil AI şu anda kullanılamıyor; bu yanıt yedek hizmetten sağlandı.
                    </Text>
                  </View>
                )}
                <FlatList
                  ref={listRef}
                  data={messages}
                  keyExtractor={(m) => m.id}
                  renderItem={renderItem}
                  contentContainerStyle={{ padding: 16, gap: 12 }}
                  ListFooterComponent={
                    loading ? (
                      <View style={styles.typingRow}>
                        <ActivityIndicator size="small" color={colors.accent} />
                        <Text style={[styles.typingText, { color: colors.mutedForeground }]}>
                          Loveİzmir AI düşünüyor…
                        </Text>
                      </View>
                    ) : null
                  }
                />
              </View>
            )}

            <View
              style={[
                styles.composer,
                {
                  backgroundColor: colors.background,
                  borderTopColor: colors.border,
                  paddingBottom:
                    (Platform.OS === "web" ? 14 : insets.bottom || 14) + 6,
                },
              ]}
            >
              {messages.length > 0 && (
                <Pressable
                  onPress={clear}
                  style={[styles.clearBtn, { borderColor: colors.border }]}
                  accessibilityRole="button"
                  accessibilityLabel="Sohbeti temizle"
                >
                  <Feather
                    name="rotate-ccw"
                    size={14}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              )}
              <TextInput
                value={input}
                accessibilityLabel="Loveİzmir AI’a mesaj yaz"
                onChangeText={setInput}
                editable={canSend}
                maxLength={4000}
                placeholder={showUnavailable ? "Bağlantı bekleniyor…" : "Loveİzmir AI’a sor…"}
                placeholderTextColor={colors.mutedForeground}
                style={[
                  styles.input,
                  {
                    color: colors.foreground,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: canSend ? 1 : 0.6,
                  },
                ]}
                onSubmitEditing={() => void onSend(input)}
                returnKeyType="send"
                multiline
              />
              <Pressable
                onPress={() => void onSend(input)}
                disabled={!canSend || !input.trim() || loading}
                style={[
                  styles.sendBtn,
                  {
                    backgroundColor:
                      !canSend || !input.trim() || loading
                        ? colors.mutedForeground
                        : colors.accent,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Gönder"
                accessibilityState={{ disabled: !canSend || !input.trim() || loading }}
              >
                <Feather name="arrow-up" size={18} color={"#fff"} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  degradedBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  degradedText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 17,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "92%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontFamily: "Poppins_700Bold", fontSize: 18 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 1 },
  personalizationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    marginTop: 2,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  welcomeCard: { borderRadius: 22, padding: 22, gap: 8 },
  welcomeTitle: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    marginTop: 6,
  },
  welcomeText: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },

  suggestionsTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.4,
    marginTop: 8,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  suggestionText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 13 },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  quickIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    lineHeight: 15,
  },

  bubbleWrap: { gap: 4 },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  aiAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  aiName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  bubble: {
    maxWidth: "88%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleText: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },

  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
    maxWidth: "88%",
  },
  actionChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
  },
  actionChipText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },

  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  typingText: { fontFamily: "Inter_500Medium", fontSize: 12 },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  clearBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderRadius: 19,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
