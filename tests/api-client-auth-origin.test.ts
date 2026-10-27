import assert from "node:assert/strict";
import test from "node:test";

import {
  customFetch,
  setAuthTokenGetter,
  setBaseUrl,
} from "../lib/api-client-react/src/custom-fetch.ts";

test("automatic bearer token remains bound to the configured API origin", async () => {
  const originalFetch = globalThis.fetch;
  const observed: Array<{ url: string; authorization: string | null }> = [];

  globalThis.fetch = async (input, init) => {
    const request = input instanceof Request ? input : null;
    const headers = new Headers(init?.headers ?? request?.headers);
    observed.push({
      url: typeof input === "string" ? input : input.toString(),
      authorization: headers.get("authorization"),
    });
    return new Response(null, { status: 204 });
  };

  setBaseUrl("https://api.loveizmir.example");
  setAuthTokenGetter(() => "test-session-token");

  try {
    await customFetch("/api/me", { responseType: "text" });
    await customFetch("https://static.example/catalog", {
      responseType: "text",
    });
  } finally {
    setAuthTokenGetter(null);
    setBaseUrl(null);
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(observed, [
    {
      url: "https://api.loveizmir.example/api/me",
      authorization: "Bearer test-session-token",
    },
    {
      url: "https://static.example/catalog",
      authorization: null,
    },
  ]);
});
