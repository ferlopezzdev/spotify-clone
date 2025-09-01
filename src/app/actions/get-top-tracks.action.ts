'use server';

import { cookies } from 'next/headers';
import axios, { isAxiosError } from 'axios';
import type { SpotifyApiError } from '@/types/api-response/me.types';
import type { SpotifyTrack } from './get-recently-played.action';

export interface SpotifyTopTracks {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
}

export async function getTopTracks(
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'
): Promise<{ tracks?: SpotifyTopTracks; error?: string }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    return { error: 'No access token found.' };
  }

  try {
    const { data } = await axios.get<SpotifyTopTracks>(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    return { tracks: data };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const apiError: SpotifyApiError = error.response.data;
      return { error: `API Error: ${apiError.error.message}` };
    }
    return { error: 'Failed to fetch top tracks.' };
  }
}