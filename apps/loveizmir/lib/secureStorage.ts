import { Platform } from "react-native";

type SecureStoreModule = typeof import("expo-secure-store");

async function load(): Promise<SecureStoreModule | null> {
  if (Platform.OS === "web") return null;
  try {
    return await import("expo-secure-store");
  } catch {
    return null;
  }
}

export async function getItem(key: string): Promise<string | null> {
  const mod = await load();
  if (!mod) return null;
  try {
    return await mod.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  const mod = await load();
  if (!mod) return;
  try {
    await mod.setItemAsync(key, value);
  } catch {
    /* noop */
  }
}

export async function deleteItem(key: string): Promise<void> {
  const mod = await load();
  if (!mod) return;
  try {
    await mod.deleteItemAsync(key);
  } catch {
    /* noop */
  }
}
