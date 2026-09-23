import { Platform } from "react-native";

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  if (Platform.OS === "web") {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      if (typeof document !== "undefined") {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      }
    } catch {
      return false;
    }
    return false;
  }
  try {
    const mod = await import("expo-clipboard");
    await mod.setStringAsync(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareText(text: string): Promise<void> {
  if (!text) return;
  if (Platform.OS === "web") {
    if (
      typeof navigator !== "undefined" &&
      typeof (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share ===
        "function"
    ) {
      try {
        await (navigator as Navigator & {
          share: (data: ShareData) => Promise<void>;
        }).share({ text });
        return;
      } catch {
        /* fall through */
      }
    }
    await copyToClipboard(text);
    return;
  }
  try {
    const { Share } = await import("react-native");
    await Share.share({ message: text });
  } catch {
    await copyToClipboard(text);
  }
}
