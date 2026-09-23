import { Platform } from "react-native";

let nativeSpeech: typeof import("expo-speech") | null = null;

async function loadNative() {
  if (Platform.OS === "web") return null;
  if (nativeSpeech) return nativeSpeech;
  try {
    nativeSpeech = await import("expo-speech");
    return nativeSpeech;
  } catch {
    return null;
  }
}

function getWebSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

export async function speak(text: string, lang = "tr-TR"): Promise<void> {
  if (!text.trim()) return;
  if (Platform.OS === "web") {
    const synth = getWebSynth();
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 1;
    utter.pitch = 1;
    synth.speak(utter);
    return;
  }
  const mod = await loadNative();
  if (!mod) return;
  try {
    mod.stop();
    mod.speak(text, { language: lang, rate: 1, pitch: 1 });
  } catch {
    /* noop */
  }
}

export async function stopSpeaking(): Promise<void> {
  if (Platform.OS === "web") {
    const synth = getWebSynth();
    synth?.cancel();
    return;
  }
  const mod = await loadNative();
  try {
    mod?.stop();
  } catch {
    /* noop */
  }
}

export async function isSpeaking(): Promise<boolean> {
  if (Platform.OS === "web") {
    return getWebSynth()?.speaking ?? false;
  }
  const mod = await loadNative();
  if (!mod) return false;
  try {
    return await mod.isSpeakingAsync();
  } catch {
    return false;
  }
}
