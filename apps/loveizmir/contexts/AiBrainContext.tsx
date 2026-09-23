import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createAiMemory,
  deleteAiData,
  deleteAiMemory,
  getAiMemories,
  getAiProfile,
  putAiProfile,
  recordAiInteraction,
  type AiMemory,
  type AiPreferenceFacets,
  type AiProfile,
} from "@/lib/aiBrainApi";
import { useAuth } from "@/lib/auth";

type AiBrainValue = {
  isSignedIn: boolean;
  profile: AiProfile | null;
  memories: AiMemory[];
  loading: boolean;
  error: string | null;
  saveProfile: (
    input: Pick<AiProfile, "memoryConsent" | "preferenceFacets">,
  ) => Promise<void>;
  addMemory: (input: {
    category: string;
    title: string;
    content: string;
  }) => Promise<void>;
  removeMemory: (id: string) => Promise<void>;
  recordInteraction: (input: {
    type: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, string | number | boolean | null>;
  }) => Promise<void>;
  forgetAll: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AiBrainContext = createContext<AiBrainValue | null>(null);
const emptyProfile: AiProfile = { memoryConsent: false, preferenceFacets: {} };

export function AiBrainProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const activeUser = useRef<string | null>(null);
  const [profile, setProfile] = useState<AiProfile | null>(null);
  const [memories, setMemories] = useState<AiMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clear = useCallback(() => {
    setProfile(null);
    setMemories([]);
    setError(null);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const [nextProfile, nextMemories] = await Promise.all([
        getAiProfile(),
        getAiMemories(),
      ]);
      if (activeUser.current === userId) {
        setProfile(nextProfile);
        setMemories(nextMemories);
      }
    } catch {
      if (activeUser.current === userId) {
        setError("AI memory settings could not load. Please try again.");
      }
    } finally {
      if (activeUser.current === userId) setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    activeUser.current = userId;
    clear();
    if (userId) void refresh();
  }, [userId, clear, refresh]);

  const saveProfile = useCallback(
    async (input: Pick<AiProfile, "memoryConsent" | "preferenceFacets">) => {
      if (!userId)
        throw new Error("Please sign in to save AI memory settings.");
      setError(null);
      try {
        const saved = await putAiProfile({ ...emptyProfile, ...input });
        if (activeUser.current === userId) setProfile(saved);
      } catch {
        setError(
          "Your AI memory settings could not be saved. Please try again.",
        );
        throw new Error("AI profile save failed");
      }
    },
    [userId],
  );

  const addMemory = useCallback(
    async (input: { category: string; title: string; content: string }) => {
      if (!userId) throw new Error("Please sign in to save a memory.");
      setError(null);
      try {
        const memory = await createAiMemory(input);
        if (activeUser.current === userId)
          setMemories((current) => [memory, ...current]);
      } catch {
        setError(
          "That memory could not be saved. Check consent and try again.",
        );
        throw new Error("AI memory save failed");
      }
    },
    [userId],
  );

  const removeMemory = useCallback(
    async (id: string) => {
      if (!userId) return;
      setError(null);
      try {
        await deleteAiMemory(id);
        if (activeUser.current === userId)
          setMemories((current) =>
            current.filter((memory) => memory.id !== id),
          );
      } catch {
        setError("That memory could not be deleted. Please try again.");
      }
    },
    [userId],
  );

  const recordInteraction = useCallback(
    async (input: {
      type: string;
      entityType?: string;
      entityId?: string;
      metadata?: Record<string, string | number | boolean | null>;
    }) => {
      if (!userId || !profile?.memoryConsent) return;
      await recordAiInteraction(input);
    },
    [profile?.memoryConsent, userId],
  );

  const forgetAll = useCallback(async () => {
    if (!userId) return;
    setError(null);
    try {
      await deleteAiData();
      if (activeUser.current === userId) {
        setProfile(emptyProfile);
        setMemories([]);
      }
    } catch {
      setError("Your AI data could not be deleted. Please try again.");
      throw new Error("AI data deletion failed");
    }
  }, [userId]);

  const value = useMemo<AiBrainValue>(
    () => ({
      isSignedIn: Boolean(userId),
      profile: activeUser.current === userId ? profile : null,
      memories: activeUser.current === userId ? memories : [],
      loading,
      error,
      saveProfile,
      addMemory,
      removeMemory,
      recordInteraction,
      forgetAll,
      refresh,
    }),
    [
      userId,
      profile,
      memories,
      loading,
      error,
      saveProfile,
      addMemory,
      removeMemory,
      recordInteraction,
      forgetAll,
      refresh,
    ],
  );
  return (
    <AiBrainContext.Provider value={value}>{children}</AiBrainContext.Provider>
  );
}

export function useAiBrain(): AiBrainValue {
  const value = useContext(AiBrainContext);
  if (!value) throw new Error("useAiBrain must be used inside AiBrainProvider");
  return value;
}
