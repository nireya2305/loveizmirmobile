import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";
import { Platform } from "react-native";

import * as SecureStore from "./secureStorage";

const AUTH_TOKEN_KEY = "auth_session_token";
const MISSING_NATIVE_API_BASE =
  "Loveİzmir API yapılandırma hatası: native uygulama için EXPO_PUBLIC_API_BASE_URL mutlak bir http(s) URL olarak ayarlanmalıdır.";

function normalizeAbsoluteBaseUrl(value: string, variableName: string): string {
  const normalized = value.trim().replace(/\/+$/, "");

  try {
    const url = new URL(normalized);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      !url.hostname
    ) {
      throw new Error("unsupported URL");
    }
  } catch {
    throw new Error(
      `Loveİzmir API yapılandırma hatası: ${variableName} mutlak bir http(s) URL olmalıdır.`,
    );
  }

  return normalized;
}

function resolveApiBase(): string {
  const explicitBase = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (explicitBase) {
    return normalizeAbsoluteBaseUrl(explicitBase, "EXPO_PUBLIC_API_BASE_URL");
  }

  // Browser deployments intentionally use their current origin so artifact
  // routing and canonical /api paths remain intact.
  if (Platform.OS === "web") return "";

  // EXPO_PUBLIC_DOMAIN is injected by the local Expo workflow. It must never
  // become an implicit production origin.
  if (__DEV__) {
    const developmentDomain = process.env.EXPO_PUBLIC_DOMAIN;
    if (developmentDomain) {
      return normalizeAbsoluteBaseUrl(
        `https://${developmentDomain}`,
        "EXPO_PUBLIC_DOMAIN",
      );
    }
  }

  throw new Error(MISSING_NATIVE_API_BASE);
}

const apiBase = resolveApiBase();
setBaseUrl(apiBase || null);

async function readSecureToken(): Promise<string | null> {
  return SecureStore.getItem(AUTH_TOKEN_KEY);
}

setAuthTokenGetter(readSecureToken);

export function getApiBase(): string {
  return apiBase;
}

export async function getAuthToken(): Promise<string | null> {
  return readSecureToken();
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = await getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${getApiBase()}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
}
