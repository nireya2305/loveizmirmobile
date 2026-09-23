import { apiFetch } from "./apiClient";

export type AiPreferenceFacets = {
  languages?: string[];
  interests?: string[];
  districts?: string[];
  accessibility?: string[];
  dietary?: string[];
};

export type AiProfile = {
  userId?: string;
  memoryConsent: boolean;
  preferenceFacets: AiPreferenceFacets;
};

export type AiMemory = {
  id: string;
  category: string;
  title: string;
  content: string;
  source?: string;
  createdAt?: string;
};

async function json<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function getAiProfile(): Promise<AiProfile> {
  return apiFetch("/api/me/ai-profile").then(json<AiProfile>);
}

export function putAiProfile(profile: AiProfile): Promise<AiProfile> {
  return apiFetch("/api/me/ai-profile", {
    method: "PUT",
    body: JSON.stringify({
      memoryConsent: profile.memoryConsent,
      preferenceFacets: profile.preferenceFacets,
    }),
  }).then(json<AiProfile>);
}

export async function getAiMemories(): Promise<AiMemory[]> {
  const result = await apiFetch("/api/me/ai-memories").then(
    json<{ memories: AiMemory[] }>,
  );
  return result.memories;
}

export function createAiMemory(input: {
  category: string;
  title: string;
  content: string;
}): Promise<AiMemory> {
  return apiFetch("/api/me/ai-memories", {
    method: "POST",
    body: JSON.stringify(input),
  }).then(json<AiMemory>);
}

export async function recordAiInteraction(input: {
  type: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}): Promise<void> {
  const response = await apiFetch("/api/me/ai-interactions", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(`Interaction could not be recorded (${response.status})`);
  }
}

export async function deleteAiMemory(id: string): Promise<void> {
  const response = await apiFetch(
    `/api/me/ai-memories/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok)
    throw new Error(`Memory could not be deleted (${response.status})`);
}

export async function deleteAiData(): Promise<void> {
  const response = await apiFetch("/api/me/ai-data", { method: "DELETE" });
  if (!response.ok)
    throw new Error(`AI data could not be deleted (${response.status})`);
}
