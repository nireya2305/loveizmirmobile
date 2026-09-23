import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import {
  IZMIR_LINK_SECTIONS,
  type LinkItem,
  type LinkSection,
} from "@/lib/izmirLinks";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

export function IzmirLinks() {
  const colors = useColors();

  const open = useCallback(async (url: string) => {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined") {
          window.open(url, "_blank", "noopener,noreferrer");
        }
        return;
      }
      await WebBrowser.openBrowserAsync(url);
    } catch {
      try {
        await Linking.openURL(url);
      } catch {
        /* noop */
      }
    }
  }, []);

  const accentColor = (a: LinkSection["accent"]): string => {
    switch (a) {
      case "coral":
        return colors.coral;
      case "aegean":
        return colors.aegean;
      case "olive":
        return colors.olive;
      case "amber":
        return "#f5a623";
      default:
        return colors.accent;
    }
  };

  return (
    <View style={styles.wrap}>
      {IZMIR_LINK_SECTIONS.map((section) => {
        const tint = accentColor(section.accent);
        return (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.iconBubble,
                  { backgroundColor: tint + "22", borderColor: tint + "55" },
                ]}
              >
                <Feather
                  name={section.icon as FeatherName}
                  size={16}
                  color={tint}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.sectionTitle, { color: colors.foreground }]}
                >
                  {section.title}
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {section.subtitle}
                </Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
            >
              {section.items.map((item: LinkItem) => (
                <Pressable
                  key={item.id}
                  onPress={() => open(item.url)}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: pressed ? 0.6 : 1,
                    },
                  ]}
                >
                  <View style={[styles.chipDot, { backgroundColor: tint }]} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.chipTitle, { color: colors.foreground }]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {item.subtitle ? (
                      <Text
                        style={[
                          styles.chipSub,
                          { color: colors.mutedForeground },
                        ]}
                        numberOfLines={1}
                      >
                        {item.subtitle}
                      </Text>
                    ) : null}
                  </View>
                  <Feather
                    name="external-link"
                    size={13}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    maxWidth: "100%",
    gap: 18,
    paddingBottom: 8,
    overflow: "hidden",
  },
  section: { width: "100%", maxWidth: "100%", gap: 10, overflow: "hidden" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  sectionTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 15 },
  sectionSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 1,
  },
  row: { paddingHorizontal: 20, gap: 10, paddingRight: 28 },
  chip: {
    width: 240,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  chipSub: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
});
