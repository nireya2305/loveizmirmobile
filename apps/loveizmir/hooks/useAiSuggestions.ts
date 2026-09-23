import { useCallback } from "react";

import type { Listing, ListingCat } from "@/contexts/ListingsContext";

const UNAVAILABLE_MESSAGE =
  "Doğrulanmış AI öneri kaynağı henüz bağlı değil. Mevcut Loveİzmir ilanlarını kullanın ve fiyat ile müsaitliği sağlayıcıdan doğrulayın.";
const NO_AI_LISTINGS: Listing[] = [];

export function useAiSuggestions(_cat: ListingCat) {
  const refresh = useCallback(async () => {
    // Intentionally disabled until the provider and source-verification
    // contract are proven through the authenticated registry.
  }, []);

  return {
    items: NO_AI_LISTINGS,
    loading: false,
    error: UNAVAILABLE_MESSAGE,
    lastUpdated: null,
    refresh,
    available: false,
  } as const;
}
