/**
 * Loveİzmir Instagram integration.
 *
 * For now this exposes the official handle + profile deep link and a
 * `getInstagramPosts()` source that returns an empty list. Once the
 * @lovei_zmir account is converted to a Creator/Business account and the
 * Replit Instagram connection is authorized, `getInstagramPosts()` will be
 * wired to the API server route that proxies the Instagram Graph API and the
 * same UI will render the live feed with zero component changes.
 */

import { OFFICIAL_INSTAGRAM } from "@/lib/brand";

export const INSTAGRAM_HANDLE = OFFICIAL_INSTAGRAM.handle!;

export const INSTAGRAM_PROFILE_URL = OFFICIAL_INSTAGRAM.profileUrl!;

export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type InstagramPost = {
  id: string;
  caption?: string;
  mediaType: InstagramMediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp?: string;
};

export type InstagramFeedResult = {
  posts: InstagramPost[];
  connected: boolean;
};

/**
 * Returns the Instagram feed for the official account.
 *
 * Until the Instagram connection is live this resolves to an empty,
 * not-connected result so the UI can show the "coming soon" state instead of
 * fabricated posts.
 */
export async function getInstagramPosts(): Promise<InstagramFeedResult> {
  return { posts: [], connected: false };
}
