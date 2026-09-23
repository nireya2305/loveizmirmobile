# Loveİzmir Product DNA

Status: `PARTIAL` — the mobile surface is implemented and locally verified;
production backend and provider readiness remain explicit runtime dependencies.

## Identity and promise

- Identity: Loveİzmir, a mobile-first guide to İzmir's living culture,
  places, food, events, news, and services.
- Promise: help people discover and enjoy İzmir with a warm, human interface.
- Primary roles: visitor, signed-in member, local partner, publisher, and
  platform administrator. Role permissions are owned by the canonical API.

## Canonical intelligence and data

- Master AI: Loveİzmir AI, orchestrated by the canonical Master AI API.
- User-facing surfaces: discovery feed, guide, İzmir news, services, and the
  Master AI sheet.
- Canonical objects: places, events, news, partners, products, transactions,
  member profiles, and agent runs from the shared API.
- Approval/risk boundary: authentication, RBAC, tenant isolation, persistence,
  payments, approvals, idempotency, audit, and external effects remain
  deterministic backend responsibilities.

## Experience system

- Navigation: Explore, Guide, İzmir News, Services, plus contextual detail
  routes and the Loveİzmir AI sheet.
- Tone: optimistic, local, clear, and welcoming.
- Visual language: sea/ocean cyan, İzmir navy, warm cream, coral accents,
  generous rounded cards, and high-contrast typography from the shared brand
  tokens in `lib/loveizmir-brand`.
- Canonical mascot/logo assets: use the repository assets; missing assets must
  remain `ASSET_MISSING` rather than replaced with generated artwork.

## Readiness states

- API origin: `https://loveizmir.com` (currently `NOT_VERIFIED` while the
  NireyaOS deployment returns 502).
- Authentication: `NOT_CONFIGURED` until the production OIDC/token exchange is
  verified.
- AI provider: `NOT_CONFIGURED` unless NireyaOS supplies a real provider key.
- Payments and partner integrations: `NOT_CONFIGURED` until their backend
  contracts and credentials are verified.
- Production release: `NOT_DEPLOYED` / `NOT_VERIFIED`.
