export type FriendlyErrorKind =
  | "offline"
  | "timeout"
  | "upstream"
  | "rateLimit"
  | "notConfigured"
  | "unknown";

export type FriendlyError = {
  kind: FriendlyErrorKind;
  title: string;
  hint: string;
  retryable: boolean;
};

const PATTERNS: Array<{ kind: FriendlyErrorKind; re: RegExp }> = [
  { kind: "offline", re: /network|fetch failed|offline|enotfound|econnreset|connection refused|networkerror|failed to fetch/i },
  { kind: "timeout", re: /timeout|timed out|etimedout|aborted/i },
  { kind: "rateLimit", re: /429|too many|rate limit/i },
  { kind: "notConfigured", re: /api key|not configured|missing key|api_key_service_blocked/i },
  { kind: "upstream", re: /upstream|502|503|504|bad gateway|service unavailable|permission_denied/i },
];

// MD-002 rule: never surface raw 404/network/server errors. Always show the
// exact reassurance copy "Canlı veriler güncelleniyor." and continue with AI.
const LIVE_UPDATING = "Canlı veriler güncelleniyor.";

const COPY_TR: Record<FriendlyErrorKind, { title: string; hint: string; retryable: boolean }> = {
  offline: {
    title: "İnternet bağlantısı zayıf",
    hint: LIVE_UPDATING,
    retryable: true,
  },
  timeout: {
    title: "Sunucu biraz yavaş",
    hint: LIVE_UPDATING,
    retryable: true,
  },
  upstream: {
    title: "Canlı kaynak şu an yanıt vermiyor",
    hint: LIVE_UPDATING,
    retryable: true,
  },
  rateLimit: {
    title: "Birazdan tekrar deneyelim",
    hint: LIVE_UPDATING,
    retryable: true,
  },
  notConfigured: {
    title: "Canlı veri devre dışı",
    hint: LIVE_UPDATING,
    retryable: false,
  },
  unknown: {
    title: "Bir aksaklık oldu",
    hint: LIVE_UPDATING,
    retryable: true,
  },
};

export function friendlyize(err: unknown): FriendlyError {
  const raw =
    err instanceof Error
      ? `${err.message} ${err.stack ?? ""}`
      : typeof err === "string"
        ? err
        : "";
  let kind: FriendlyErrorKind = "unknown";
  for (const p of PATTERNS) {
    if (p.re.test(raw)) {
      kind = p.kind;
      break;
    }
  }
  const copy = COPY_TR[kind];
  return { kind, ...copy };
}

export function friendlyMessage(err: unknown): string {
  return friendlyize(err).hint;
}
