// Provider status is server-owned at GET /api/integrations. This module only
// keeps user-facing compatibility disclosure for the mobile runtime.

// User-facing compatibility disclosure only. Provider lifecycle and routing
// remain server-owned by /api/integrations.
export const AI_INTEGRATION_DISCLOSURE = {
  label: "Loveİzmir Heart AI",
  status: "degraded",
  authoritativeStatusEndpoint: "/api/integrations",
} as const;
