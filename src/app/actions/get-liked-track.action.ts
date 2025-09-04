"use server";

import { cookies } from "next/headers";
import axios, { isAxiosError } from "axios";
import type { SpotifyApiError } from "@/types/api-response/me.types";
import type { SpotifyTrack } from "./get-recently-played.action";

export interface SpotifySavedTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface SpotifySavedTracks {
  href: string;
  items: SpotifySavedTrack[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export async function getLikedTracks(): Promise<{
  tracks?: SpotifySavedTracks;
  error?: string;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    return { error: "No access token found." };
  }

  try {
    const { data } = await axios.get<SpotifySavedTracks>(
      `https://api.spotify.com/v1/me/tracks?limit=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { tracks: data };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const apiError: SpotifyApiError = error.response.data;
      return { error: `API Error: ${apiError.error.message}` };
    }
    return { error: "Failed to fetch liked tracks." };
  }
}
