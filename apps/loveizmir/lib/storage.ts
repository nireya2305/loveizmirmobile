import { Platform } from "react-native";

type Store = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

let cached: Store | null = null;

async function getStore(): Promise<Store> {
  if (cached) return cached;
  if (Platform.OS === "web") {
    cached = {
      async getItem(key) {
        try {
          return typeof localStorage !== "undefined"
            ? localStorage.getItem(key)
            : null;
        } catch {
          return null;
        }
      },
      async setItem(key, value) {
        try {
          if (typeof localStorage !== "undefined") {
            localStorage.setItem(key, value);
          }
        } catch {
          /* noop */
        }
      },
      async removeItem(key) {
        try {
          if (typeof localStorage !== "undefined") {
            localStorage.removeItem(key);
          }
        } catch {
          /* noop */
        }
      },
    };
    return cached;
  }
  try {
    const mod = await import("@react-native-async-storage/async-storage");
    const AsyncStorage = mod.default;
    cached = {
      getItem: (k) => AsyncStorage.getItem(k),
      setItem: (k, v) => AsyncStorage.setItem(k, v),
      removeItem: (k) => AsyncStorage.removeItem(k),
    };
  } catch {
    cached = {
      async getItem() {
        return null;
      },
      async setItem() {},
      async removeItem() {},
    };
  }
  return cached;
}

export async function getJSON<T>(key: string): Promise<T | null> {
  const store = await getStore();
  const raw = await store.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  const store = await getStore();
  await store.setItem(key, JSON.stringify(value));
}

export async function getString(key: string): Promise<string | null> {
  const store = await getStore();
  return store.getItem(key);
}

export async function setString(key: string, value: string): Promise<void> {
  const store = await getStore();
  await store.setItem(key, value);
}

export async function removeKey(key: string): Promise<void> {
  const store = await getStore();
  await store.removeItem(key);
}
