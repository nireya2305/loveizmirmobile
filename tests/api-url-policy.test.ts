import assert from "node:assert/strict";
import test from "node:test";

import { normalizeApiBaseUrl } from "../apps/loveizmir/lib/apiUrlPolicy.ts";

test("accepts and normalizes a secure API origin", () => {
  assert.equal(
    normalizeApiBaseUrl(" https://api.loveizmir.com/// ", false),
    "https://api.loveizmir.com",
  );
});

test("rejects cleartext remote API origins even in development", () => {
  assert.throws(
    () => normalizeApiBaseUrl("http://api.loveizmir.com", true),
    /HTTPS kullanmalıdır/,
  );
});

test("allows cleartext loopback only for local development", () => {
  assert.equal(
    normalizeApiBaseUrl("http://127.0.0.1:8080/", true),
    "http://127.0.0.1:8080",
  );
  assert.throws(
    () => normalizeApiBaseUrl("http://127.0.0.1:8080", false),
    /HTTPS kullanmalıdır/,
  );
});

test("rejects credentials, query strings, and fragments", () => {
  for (const value of [
    "https://user:pass@api.loveizmir.com",
    "https://api.loveizmir.com?target=other",
    "https://api.loveizmir.com#other",
  ]) {
    assert.throws(() => normalizeApiBaseUrl(value, false), /temiz bir origin/);
  }
});
