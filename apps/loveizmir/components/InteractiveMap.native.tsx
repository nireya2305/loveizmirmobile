import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { useColors } from "@/hooks/useColors";
import { getApiBase } from "@/lib/apiClient";

export function InteractiveMap({ height = 480 }: { height?: number }) {
  const colors = useColors();
  const router = useRouter();
  const ref = useRef<WebView>(null);

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(e.nativeEvent.data) as
        | { type: "askAi"; title: string }
        | { type: "error"; message: string };
      // legacy askAi push removed
    } catch {
      /* ignore */
    }
  };

  const uri = `${getApiBase()}/api/maps/embed`;

  return (
    <View
      style={[
        styles.wrap,
        { height, backgroundColor: colors.aegeanDeep, borderColor: colors.border },
      ]}
    >
      <WebView
        ref={ref}
        source={{ uri }}
        onMessage={onMessage}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color="#fff" />
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        style={{ flex: 1, backgroundColor: "transparent" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
