# Loveİzmir Mobile

Canonical Expo mobile client for Loveİzmir. The app uses the shared Loveİzmir
API at `https://loveizmir.com` and keeps the web/mobile product identity in one
backend.

## Local development

```bash
pnpm install
EXPO_PUBLIC_API_BASE_URL=https://loveizmir.com pnpm dev
```

Press `i` in Expo to open the iOS simulator. `EXPO_PUBLIC_API_BASE_URL` can be
overridden for a local API; the app rejects relative native API URLs.

For a simulator-native build (without Expo Go version coupling):

```bash
pnpm install
pnpm --filter @workspace/loveizmir exec expo run:ios --device "iPhone 17 Pro"
```

## Verification

```bash
pnpm typecheck
pnpm build
```

The backend, authentication provider, and AI provider remain explicit runtime
configuration. Missing providers are reported as `NOT_CONFIGURED`; no fake
connected state is used.
