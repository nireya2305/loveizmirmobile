import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAiBrain } from "@/contexts/AiBrainContext";
import { useColors } from "@/hooks/useColors";

const splitFacets = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((item) => item.slice(0, 80));

export function AiBrainControls() {
  const colors = useColors();
  const {
    isSignedIn,
    profile,
    memories,
    loading,
    error,
    saveProfile,
    addMemory,
    removeMemory,
    forgetAll,
  } = useAiBrain();
  const [interests, setInterests] = useState("");
  const [districts, setDistricts] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (profile) {
      setInterests((profile.preferenceFacets.interests ?? []).join(", "));
      setDistricts((profile.preferenceFacets.districts ?? []).join(", "));
    }
  }, [profile]);

  if (!isSignedIn) {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          AI memory
        </Text>
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          You are not signed in. Your existing profile memories stay on this
          device and are not synced to AI.
        </Text>
      </View>
    );
  }

  const consent = profile?.memoryConsent ?? false;
  const savePreferences = async () => {
    await saveProfile({
      memoryConsent: consent,
      preferenceFacets: {
        ...(profile?.preferenceFacets ?? {}),
        interests: splitFacets(interests),
        districts: splitFacets(districts),
      },
    });
  };
  const toggleConsent = async () => {
    await saveProfile({
      memoryConsent: !consent,
      preferenceFacets: profile?.preferenceFacets ?? {},
    });
  };
  const onAdd = async () => {
    if (!title.trim() || !content.trim()) return;
    await addMemory({
      category: "preference",
      title: title.trim().slice(0, 160),
      content: content.trim().slice(0, 2000),
    });
    setTitle("");
    setContent("");
  };
  const confirmForget = () =>
    Alert.alert(
      "Forget AI data?",
      "This permanently deletes saved AI preferences, memories, and AI interaction history for this account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete everything",
          style: "destructive",
          onPress: () => void forgetAll(),
        },
      ],
    );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>
        AI memory
      </Text>
      <Text style={[styles.hint, { color: colors.mutedForeground }]}>
        Only details you explicitly save here can personalize signed-in AI
        chats. Local profile memories are never uploaded automatically.
      </Text>
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.error, { color: colors.coral }]}
        >
          {error}
        </Text>
      ) : null}
      <Pressable
        onPress={() => void toggleConsent()}
        style={[
          styles.consent,
          {
            borderColor: consent ? colors.accent : colors.border,
            backgroundColor: consent ? colors.accent + "22" : colors.background,
          },
        ]}
        accessibilityRole="switch"
        accessibilityState={{ checked: consent }}
        accessibilityLabel="Allow AI memory"
      >
        <Feather
          name={consent ? "check-circle" : "circle"}
          size={20}
          color={colors.accent}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.buttonText, { color: colors.foreground }]}>
            {consent ? "AI memory is on" : "Allow AI memory"}
          </Text>
          <Text style={[styles.small, { color: colors.mutedForeground }]}>
            {consent
              ? "Explicit memories and preferences may be applied to future replies."
              : "Turn this on before adding an account memory."}
          </Text>
        </View>
      </Pressable>
      <TextInput
        value={interests}
        onChangeText={setInterests}
        maxLength={1619}
        placeholder="Interests (comma separated, up to 20)"
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.input,
          {
            color: colors.foreground,
            borderColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      />
      <TextInput
        value={districts}
        onChangeText={setDistricts}
        maxLength={1619}
        placeholder="Districts (comma separated, up to 20)"
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.input,
          {
            color: colors.foreground,
            borderColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      />
      <Pressable
        onPress={() => void savePreferences()}
        style={[styles.button, { backgroundColor: colors.aegeanDeep }]}
        accessibilityRole="button"
        accessibilityLabel="Save AI preferences"
      >
        <Text style={styles.buttonLight}>Save preferences</Text>
      </Pressable>
      <Text style={[styles.label, { color: colors.foreground }]}>
        Add an AI memory
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        maxLength={160}
        placeholder="Short title"
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.input,
          {
            color: colors.foreground,
            borderColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        maxLength={2000}
        multiline
        placeholder="A detail you want AI to remember"
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.input,
          styles.multiline,
          {
            color: colors.foreground,
            borderColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      />
      <Pressable
        disabled={!consent || !title.trim() || !content.trim()}
        onPress={() => void onAdd()}
        style={[
          styles.button,
          {
            backgroundColor:
              consent && title.trim() && content.trim()
                ? colors.accent
                : colors.muted,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Add AI memory"
        accessibilityState={{
          disabled: !consent || !title.trim() || !content.trim(),
        }}
      >
        <Text style={styles.buttonLight}>Add memory</Text>
      </Pressable>
      <Text style={[styles.label, { color: colors.foreground }]}>
        Saved account memories ({memories.length})
      </Text>
      {loading ? (
        <Text style={[styles.small, { color: colors.mutedForeground }]}>
          Loading account memory…
        </Text>
      ) : (
        memories.map((memory) => (
          <View
            key={memory.id}
            style={[styles.memory, { borderColor: colors.border }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.buttonText, { color: colors.foreground }]}>
                {memory.title}
              </Text>
              <Text
                style={[styles.small, { color: colors.mutedForeground }]}
                numberOfLines={2}
              >
                {memory.content}
              </Text>
            </View>
            <Pressable
              onPress={() => void removeMemory(memory.id)}
              style={styles.delete}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${memory.title}`}
            >
              <Feather name="trash-2" size={18} color={colors.coral} />
            </Pressable>
          </View>
        ))
      )}
      <Pressable
        onPress={confirmForget}
        style={[styles.forget, { borderColor: colors.coral }]}
        accessibilityRole="button"
        accessibilityLabel="Delete all AI account data"
      >
        <Feather name="trash-2" size={16} color={colors.coral} />
        <Text style={[styles.forgetText, { color: colors.coral }]}>
          Delete all AI account data
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 10 },
  title: { fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  hint: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 18 },
  error: { fontFamily: "Inter_500Medium", fontSize: 12 },
  consent: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  multiline: { minHeight: 76, paddingTop: 10, textAlignVertical: "top" },
  button: {
    minHeight: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  buttonLight: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 },
  buttonText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  small: { fontFamily: "Inter_400Regular", fontSize: 11, lineHeight: 16 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 13, marginTop: 4 },
  memory: {
    minHeight: 48,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  delete: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  forget: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  forgetText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
});
