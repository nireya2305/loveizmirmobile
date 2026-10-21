const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function normalizeApiBaseUrl(
  value: string,
  allowInsecureLoopback: boolean,
): string {
  const normalized = value.trim().replace(/\/+$/, "");

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    throw new Error(
      "Loveİzmir API yapılandırma hatası: API adresi mutlak bir HTTPS URL olmalıdır.",
    );
  }

  if (!url.hostname || (url.protocol !== "https:" && url.protocol !== "http:")) {
    throw new Error(
      "Loveİzmir API yapılandırma hatası: API adresi mutlak bir HTTPS URL olmalıdır.",
    );
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new Error(
      "Loveİzmir API yapılandırma hatası: API adresi kimlik bilgisi, sorgu veya parça içermeyen temiz bir origin olmalıdır.",
    );
  }

  const insecureLoopbackAllowed =
    allowInsecureLoopback && LOOPBACK_HOSTS.has(url.hostname.toLowerCase());
  if (url.protocol !== "https:" && !insecureLoopbackAllowed) {
    throw new Error(
      "Loveİzmir API yapılandırma hatası: uzak API adresi HTTPS kullanmalıdır; HTTP yalnız yerel geliştirme loopback adreslerinde kullanılabilir.",
    );
  }

  return normalized;
}
