import { useCallback, useEffect, useRef, useState } from "react";

import {
  listCanonicalPlaces,
  type CanonicalPlace,
} from "@workspace/api-client-react";

import { getApiBase } from "@/lib/apiClient";

export type Place = {
  id: string;
  title: string;
  address: string | null;
  rating: number | null;
  ratingCount: number | null;
  priceLevel: string | null;
  websiteUrl: string | null;
  mapsUrl: string | null;
  phone: string | null;
  type: string | null;
  photoUrl: string | null;
  location: { lat?: number; lng?: number } | null;
  businessId?: string;
};

export type PlaceCategory =
  | "hotel"
  | "restaurant"
  | "attraction"
  | "cafe"
  | "boat"
  | "car";

export function resolvePhotoUrl(relative: string | null): string | null {
  if (!relative) return null;
  if (relative.startsWith("http")) return relative;
  return `${getApiBase()}${relative}`;
}

type CanonicalPlacePresentationFields = {
  address?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  priceLevel?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

/**
 * Keeps the legacy card model independent from the canonical API envelope.
 * Provider-specific fields intentionally remain unavailable on canonical data.
 */
function toPlace(place: CanonicalPlace): Place {
  const details = place as CanonicalPlace & CanonicalPlacePresentationFields;
  const latitude = details.latitude ?? undefined;
  const longitude = details.longitude ?? undefined;

  return {
    id: place.id,
    title: place.canonicalName,
    address: details.address ?? null,
    rating: null,
    ratingCount: null,
    priceLevel: details.priceLevel ?? null,
    websiteUrl: details.websiteUrl ?? null,
    mapsUrl: null,
    phone: details.phone ?? null,
    type: place.category ?? null,
    photoUrl: null,
    location:
      latitude === undefined && longitude === undefined
        ? null
        : { lat: latitude, lng: longitude },
    businessId: place.businessId ?? undefined,
  };
}

function getPublicErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Yerler yüklenemedi.";
  }

  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== "object") {
    return "Yerler yüklenemedi.";
  }

  const publicError = (data as { error?: unknown }).error;
  if (!publicError || typeof publicError !== "object") {
    return "Yerler yüklenemedi.";
  }

  const message = (publicError as { message?: unknown }).message;
  return typeof message === "string" && message.trim()
    ? message.trim()
    : "Yerler yüklenemedi.";
}

export function usePlaces(category: PlaceCategory, query?: string) {
  const [items, setItems] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await listCanonicalPlaces({
        category,
        q: query?.trim() || undefined,
        limit: 12,
      });
      setItems((data.data?.items ?? []).map(toPlace));
      setLastUpdated(Date.now());
    } catch (e) {
      setError(getPublicErrorMessage(e));
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, [category, query]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, error, lastUpdated, refresh };
}
