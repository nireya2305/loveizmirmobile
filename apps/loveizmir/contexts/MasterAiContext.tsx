import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "expo-router";
import { useGetIzmirAiWidgetStatus, getGetIzmirAiWidgetStatusQueryKey } from "@workspace/api-client-react";

import { useAiBrain } from "@/contexts/AiBrainContext";
import { INTELLIGENCE_MODES } from "@/lib/izmirKnowledge";
import {
  askLoveizmir,
  type ChatMessage,
  type LoveIzmirAction,
} from "@/lib/loveizmirApi";
import { useAuth } from "@/lib/auth";

type WidgetStatus = {
  available: boolean;
  providerStatus: number | null;
  masterAiId: "cmpc4e2bs008do801m8ced3bd";
  registryState:
    | "CONNECTED"
    | "DEGRADED"
    | "UPSTREAM_UNAVAILABLE"
    | "UNKNOWN";
  canonicalVerified: boolean;
  blockerCode: string | null;
};

function isWidgetStatus(value: unknown): value is WidgetStatus {
  if (typeof value !== "object" || value === null) return false;
  const status = value as Record<string, unknown>;
  return (
    typeof status.available === "boolean" &&
    (typeof status.providerStatus === "number" ||
      status.providerStatus === null) &&
    status.masterAiId === "cmpc4e2bs008do801m8ced3bd" &&
    (status.registryState === "CONNECTED" ||
      status.registryState === "DEGRADED" ||
      status.registryState === "UPSTREAM_UNAVAILABLE" ||
      status.registryState === "UNKNOWN") &&
    typeof status.canonicalVerified === "boolean" &&
    (typeof status.blockerCode === "string" || status.blockerCode === null)
  );
}

export type MasterMsg = ChatMessage & {
  id: string;
  actions?: LoveIzmirAction[];
};
export type PersonalizationStatus = {
  applied: boolean;
  memoryCount: number;
  interactionsCount: number;
};
export type OrchestrationStatus = {
  applied: true;
  executionMode: "LOCAL_CONTRACT_PLAN";
  agentCount: number;
  qualityScore: number;
  qualityPassed: boolean;
};

type MasterAiValue = {
  isOpen: boolean;
  open: (initial?: string) => void;
  openAndSend: (text: string) => void;
  close: () => void;
  messages: MasterMsg[];
  loading: boolean;
  send: (text: string, opts?: { modeKey?: string | null }) => Promise<void>;
  clear: () => void;
  suggestions: string[];
  mode: string | null;
  setMode: (mode: string | null) => void;
  openWithMode: (modeKey: string) => void;
  responseState: "idle" | "primary" | "degraded" | "unavailable";
  personalization: PersonalizationStatus | null;
  orchestration: OrchestrationStatus | null;
  canSend: boolean;
  widgetStatusLoading: boolean;
  widgetStatusError: boolean;
};

const MasterAiContext = createContext<MasterAiValue | null>(null);

function parseActions(raw: string): {
  clean: string;
  actions: LoveIzmirAction[];
} {
  const re = /\[(GO|MAP|WA):([^\]|]+)\|([^\]]+)\]/g;
  const actions: LoveIzmirAction[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const kind = m[1];
    const target = m[2].trim();
    const label = m[3].trim();
    if (!target || !label) continue;
    if (kind === "GO") {
      actions.push({ type: "OPEN_PAGE", target, label });
    } else if (kind === "MAP") {
      actions.push({ type: "OPEN_MAP", target, label });
    } else if (kind === "WA") {
      actions.push({ type: "PREPARE_WHATSAPP", target, label });
    }
  }
  const clean = raw.replace(re, "").replace(/\s+$/g, "").trim();
  return { clean, actions: actions.slice(0, 3) };
}

function newId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 7);
}

const SUGGESTIONS: string[] = [];

export function MasterAiProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MasterMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setModeState] = useState<string | null>(null);
  const [responseState, setResponseState] =
    useState<MasterAiValue["responseState"]>("idle");
  const [personalization, setPersonalization] =
    useState<PersonalizationStatus | null>(null);
  const [orchestration, setOrchestration] =
    useState<OrchestrationStatus | null>(null);
  const loadingRef = useRef(false);
  const messagesRef = useRef<MasterMsg[]>([]);
  const modeRef = useRef<string | null>(null);
  const chatGenerationRef = useRef(0);
  const { user } = useAuth();
  const authSubject = user?.id ?? "anonymous";
  const pathname = usePathname();

  const { data: widgetStatusRes, isLoading: widgetStatusLoading, isError: widgetStatusQueryError } = useGetIzmirAiWidgetStatus({
    query: { enabled: isOpen, queryKey: getGetIzmirAiWidgetStatusQueryKey() }
  });
  const widgetStatus = isWidgetStatus(widgetStatusRes) ? widgetStatusRes : null;
  const widgetStatusMalformed =
    widgetStatusRes !== undefined && widgetStatus === null;
  const widgetStatusError = widgetStatusQueryError || widgetStatusMalformed;
  const canSend =
    widgetStatus?.available === true &&
    widgetStatus.canonicalVerified === true;


  const setMode = useCallback((m: string | null) => {
    modeRef.current = m;
    setModeState(m);
  }, []);

  const { recordInteraction } = useAiBrain();

  const open = useCallback((initial?: string) => {
    setIsOpen(true);
    if (initial) {
      const userMsg: MasterMsg = {
        id: newId(),
        role: "user",
        content: initial,
      };
      setMessages((prev) => [...prev, userMsg]);
    }
  }, []);

  const [pendingSend, setPendingSend] = useState<string | null>(null);

  const openAndSend = useCallback((text: string) => {
    setIsOpen(true);
    setPendingSend(text);
  }, []);

  useEffect(() => {
    if (pendingSend && isOpen && !widgetStatusLoading) {
      if (canSend) {
        sendRef.current?.(pendingSend);
      } else {
        // Enforce visible degraded/unavailable state
        setResponseState("unavailable");
      }
      setPendingSend(null);
    }
  }, [pendingSend, isOpen, widgetStatusLoading, canSend]);


  const close = useCallback(() => setIsOpen(false), []);
  const clear = useCallback(() => {
    setMessages([]);
    setResponseState("idle");
    setPersonalization(null);
    setOrchestration(null);
  }, []);

  useLayoutEffect(() => {
    chatGenerationRef.current += 1;
    clear();
    messagesRef.current = [];
    loadingRef.current = false;
    setLoading(false);
  }, [authSubject, clear]);

  const sendRef = useRef<
    ((text: string, opts?: { modeKey?: string | null }) => Promise<void>) | null
  >(null);

  const openWithMode = useCallback((modeKey: string) => {
    const m = INTELLIGENCE_MODES.find((x) => x.key === modeKey);
    modeRef.current = modeKey;
    setModeState(modeKey);
    setIsOpen(true);
    if (m) {
      // capture modeKey at tap-time so concurrent taps don't cross-pollute prompts
      void Promise.resolve().then(() =>
        sendRef.current?.(m.starterPrompt, { modeKey }),
      );
    }
  }, []);

  const send = useCallback(
    async (text: string) => {
      let trimmed = text.trim();
      if (!trimmed || loadingRef.current) return;
      if (!canSend) {
        setResponseState("unavailable");
        return;
      }
      if (trimmed.length > 4000) trimmed = trimmed.substring(0, 4000);

      const requestGeneration = chatGenerationRef.current;
      const userMsg: MasterMsg = {
        id: newId(),
        role: "user",
        content: trimmed,
      };
      messagesRef.current = [...messagesRef.current, userMsg];
      setMessages(messagesRef.current);
      setLoading(true);
      loadingRef.current = true;
      try {
        const history: ChatMessage[] = messagesRef.current
          .slice(-11, -1)
          .map((m) => ({
            role: m.role,
            content: m.content.substring(0, 4000),
          }));
        const result = await askLoveizmir(trimmed, history, pathname);
        if (requestGeneration !== chatGenerationRef.current) return;
        setResponseState(
          result.degraded || result.source === "replit_ai_fallback"
            ? "degraded"
            : "primary",
        );
        setPersonalization(result.personalization);
        setOrchestration(result.orchestration);
        void recordInteraction({
          type: "ai_response",
          entityType: "screen",
          entityId: pathname,
          metadata: {
            locale: "tr",
            source: result.source,
            degraded: result.degraded,
            agentCount: result.orchestration.agentCount,
            qualityScore: result.orchestration.qualityScore,
            qualityPassed: result.orchestration.qualityPassed,
          },
        }).catch(() => undefined);
        const parsedReply = parseActions(result.reply);
        const aiMsg: MasterMsg = {
          id: newId(),
          role: "assistant",
          content: parsedReply.clean || "Üzgünüm, bir cevap üretemedim.",
          actions: [...result.actions, ...parsedReply.actions].slice(0, 3),
        };
        messagesRef.current = [...messagesRef.current, aiMsg];
        setMessages(messagesRef.current);
      } catch (e) {
        if (requestGeneration !== chatGenerationRef.current) return;
        setResponseState("unavailable");
        const aiMsg: MasterMsg = {
          id: newId(),
          role: "assistant",
          content: "Loveİzmir AI bağlantısı şu anda hazırlanıyor. Keşfet ve Rehber bölümlerini kullanmaya devam edebilirsin.",
        };
        messagesRef.current = [...messagesRef.current, aiMsg];
        setMessages(messagesRef.current);
      } finally {
        if (requestGeneration === chatGenerationRef.current) {
          setLoading(false);
          loadingRef.current = false;
        }
      }
    },
    [pathname, recordInteraction, canSend],
  );

  sendRef.current = send;

  const value = useMemo<MasterAiValue>(
    () => ({
      isOpen,
      open,
      openAndSend,
      close,
      messages,
      loading,
      send,
      clear,
      suggestions: SUGGESTIONS,
      mode,
      setMode,
      openWithMode,
      responseState,
      personalization,
      orchestration,
      canSend,
      widgetStatusLoading,
      widgetStatusError,
    }),
    [
      isOpen,
      open,
      openAndSend,
      close,
      messages,
      loading,
      send,
      clear,
      mode,
      setMode,
      openWithMode,
      responseState,
      personalization,
      orchestration,
      canSend,
      widgetStatusLoading,
      widgetStatusError,
    ],
  );

  return (
    <MasterAiContext.Provider value={value}>
      {children}
    </MasterAiContext.Provider>
  );
}

export function useMasterAi() {
  const ctx = useContext(MasterAiContext);
  if (!ctx) throw new Error("useMasterAi must be used inside MasterAiProvider");
  return ctx;
}
