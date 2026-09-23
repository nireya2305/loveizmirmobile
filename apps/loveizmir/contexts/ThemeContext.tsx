import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "system" | "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const STORAGE_KEY = "loveizmir.theme.v1";
const DEFAULT_THEME_STATE: ThemeState = {
  mode: "system",
  isDark: false,
  setMode: async () => undefined,
  toggleTheme: async () => undefined,
};

const ThemeContext = createContext<ThemeState>(DEFAULT_THEME_STATE);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === "system" || stored === "light" || stored === "dark") {
          setModeState(stored);
        }
      })
      .catch((error: unknown) => {
        console.warn("Theme preference could not be read", error);
      });
  }, []);

  const setMode = useCallback(async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextMode);
    } catch (error: unknown) {
      console.warn("Theme preference could not be saved", error);
    }
  }, []);

  const toggleTheme = useCallback(
    async () => setMode(isDark ? "light" : "dark"),
    [isDark, setMode],
  );

  const value = useMemo(
    () => ({ mode, isDark, setMode, toggleTheme }),
    [isDark, mode, setMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
