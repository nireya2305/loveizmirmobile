import { apiFetch } from "./apiClient";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type LoveIzmirAction = {
  type: "OPEN_PAGE" | "OPEN_MAP" | "PREPARE_WHATSAPP";
  target: string;
  label: string;
};

export type LoveIzmirChatResult = {
  reply: string;
  actions: LoveIzmirAction[];
  source: "master_ai" | "replit_ai_fallback";
  degraded: boolean;
  personalization: {
    applied: boolean;
    memoryCount: number;
    interactionsCount: number;
  };
  orchestration: {
    applied: true;
    executionMode: "LOCAL_CONTRACT_PLAN";
    agentCount: number;
    qualityScore: number;
    qualityPassed: boolean;
  };
};

export async function askLoveizmir(
  message: string,
  history: ChatMessage[] = [],
  currentScreen: string = "/",
): Promise<LoveIzmirChatResult> {
  const boundedMessage = message.trim().slice(0, 4000);
  const boundedHistory = history.slice(-10).map((item) => ({
    role: item.role,
    content: item.content.slice(0, 4000),
  }));
  const boundedCurrentScreen = currentScreen.slice(0, 200) || "/";

  const response = await apiFetch("/api/izmir-ai/chat", {
    method: "POST",
    body: JSON.stringify({
      message: boundedMessage,
      history: boundedHistory,
      locale: "tr",
      currentScreen: boundedCurrentScreen,
    }),
  });
  if (!response.ok) throw new Error(`Loveİzmir AI error ${response.status}`);
  return response.json() as Promise<LoveIzmirChatResult>;
}

export type ToolCapability = {
  id: string;
  version: "5.0";
  category: string;
  availability: "local" | "blocked" | "deferred";
  sideEffectClass: "read" | "write" | "financial";
  confirmationRequired: boolean;
  providerState: "ACTIVE" | "BLOCKED_EXTERNAL" | "NOT_CONFIGURED" | "DEFERRED";
};

export type ToolCapabilities = {
  registryVersion: "5.0";
  toolCount: number;
  activeProviderCount: number;
  providersConnected: boolean;
  tools: ToolCapability[];
};

export async function getToolCapabilities(): Promise<ToolCapabilities> {
  const response = await apiFetch("/api/tools/capabilities", {
    method: "GET",
  });
  if (!response.ok) throw new Error(`Capabilities error ${response.status}`);
  return response.json() as Promise<ToolCapabilities>;
}

export type KnowledgeSourceStatus =
  | "VERIFIED"
  | "UNVERIFIED"
  | "FAILED"
  | "BLOCKED_EXTERNAL";

export type KnowledgeEntityData = { [key: string]: unknown };

export interface KnowledgeScore {
  id: string;
  entityId: string;
  scoreType: string;
  score: number | null;
  modelKey: string;
  evidenceHash: string;
  availability: string;
  scoredAt?: string;
  createdAt: string;
}

export interface KnowledgeEntity {
  id: string;
  canonicalKey: string;
  entityType: string;
  revision: number;
  data: KnowledgeEntityData;
  sourceStatus: KnowledgeSourceStatus;
  sourceFreshness: "KNOWN" | "UNKNOWN";
  sourceObservedAt: string;
  scores?: KnowledgeScore[];
}

export interface KnowledgeSearchResult {
  items: KnowledgeEntity[];
  limit: number;
  offset: number;
}

export interface SearchKnowledgeParams {
  q?: string;
  district?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export async function searchKnowledge(
  params: SearchKnowledgeParams,
): Promise<KnowledgeSearchResult> {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.append("q", params.q);
  if (params.district) queryParams.append("district", params.district);
  if (params.type) queryParams.append("type", params.type);

  const limit = params.limit !== undefined ? params.limit : 5;
  // Ensure bounds remain <= 5 as per requirements
  queryParams.append("limit", Math.min(limit, 5).toString());

  if (params.offset !== undefined) {
    queryParams.append("offset", params.offset.toString());
  }

  const response = await apiFetch(
    `/api/knowledge/search?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );
  if (!response.ok)
    throw new Error(`Knowledge search error ${response.status}`);
  return response.json() as Promise<KnowledgeSearchResult>;
}
