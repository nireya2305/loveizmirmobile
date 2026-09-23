import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getJSON, setJSON } from "@/lib/storage";
import { useAuth } from "@/lib/auth";

export type VisitedPlace = {
  id: string;
  name: string;
  note?: string;
  rating: number; // 1-5
  visitedAt: string; // ISO date
};

export type Memory = {
  id: string;
  title: string;
  text: string;
  date: string; // ISO
  photoUri?: string;
  emoji?: string;
};

type State = {
  visited: VisitedPlace[];
  memories: Memory[];
};

const getStorageKey = (userId?: string) =>
  `loveizmir.profile.v1.${userId || "anonymous"}`;

type ProfileContextValue = State & {
  ready: boolean;
  addVisited: (data: Omit<VisitedPlace, "id" | "visitedAt">) => void;
  updateVisited: (id: string, patch: Partial<VisitedPlace>) => void;
  removeVisited: (id: string) => void;
  addMemory: (data: Omit<Memory, "id">) => void;
  updateMemory: (id: string, patch: Partial<Memory>) => void;
  removeMemory: (id: string) => void;
  avgRating: number;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);

function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const storageKey = getStorageKey(user?.id);

  const [visited, setVisited] = useState<VisitedPlace[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [ready, setReady] = useState(false);

  const prevKey = React.useRef(storageKey);
  if (prevKey.current !== storageKey) {
    prevKey.current = storageKey;
    setVisited([]);
    setMemories([]);
    setReady(false);
  }

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    (async () => {
      const data = await getJSON<State>(storageKey);
      if (!cancelled) {
        if (data && Array.isArray(data.visited)) {
          setVisited(data.visited);
        } else {
          setVisited([]);
        }
        if (data && Array.isArray(data.memories)) {
          setMemories(data.memories);
        } else {
          setMemories([]);
        }
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    void setJSON<State>(storageKey, { visited, memories });
  }, [visited, memories, ready, storageKey]);

  const addVisited: ProfileContextValue["addVisited"] =
    useCallback(() => {}, []);
  const updateVisited: ProfileContextValue["updateVisited"] =
    useCallback(() => {}, []);
  const removeVisited: ProfileContextValue["removeVisited"] =
    useCallback(() => {}, []);
  const addMemory: ProfileContextValue["addMemory"] = useCallback(() => {}, []);
  const updateMemory: ProfileContextValue["updateMemory"] =
    useCallback(() => {}, []);
  const removeMemory: ProfileContextValue["removeMemory"] =
    useCallback(() => {}, []);

  const avgRating = useMemo(() => {
    if (visited.length === 0) return 0;
    const sum = visited.reduce((acc, v) => acc + v.rating, 0);
    return Math.round((sum / visited.length) * 10) / 10;
  }, [visited]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      visited,
      memories,
      ready,
      addVisited,
      updateVisited,
      removeVisited,
      addMemory,
      updateMemory,
      removeMemory,
      avgRating,
    }),
    [
      visited,
      memories,
      ready,
      addVisited,
      updateVisited,
      removeVisited,
      addMemory,
      updateMemory,
      removeMemory,
      avgRating,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
