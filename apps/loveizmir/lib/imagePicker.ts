import { Platform } from "react-native";

export async function pickImage(): Promise<string | null> {
  if (Platform.OS === "web") {
    return await pickImageWeb();
  }
  try {
    const ImagePicker = await import("expo-image-picker");
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return null;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: false,
    });
    if (result.canceled) return null;
    const asset = result.assets?.[0];
    return asset?.uri ?? null;
  } catch {
    return null;
  }
}

function pickImageWeb(): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(null);
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    let settled = false;
    const finish = (val: string | null) => {
      if (settled) return;
      settled = true;
      try {
        document.body.removeChild(input);
      } catch {
        /* noop */
      }
      resolve(val);
    };

    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) {
        finish(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        finish(typeof result === "string" ? result : null);
      };
      reader.onerror = () => finish(null);
      reader.readAsDataURL(file);
    });
    input.addEventListener("cancel", () => finish(null));

    document.body.appendChild(input);
    input.click();
  });
}
