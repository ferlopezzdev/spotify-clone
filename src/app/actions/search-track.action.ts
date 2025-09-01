
'use server';

import { cookies } from 'next/headers';
import type { SpotifySearchTracksResponse, SpotifyTrack } from '@/types/api-response/search-tracks.types';

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
    const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch search results: ${response.statusText}`);
  }

  const data: SpotifySearchTracksResponse = await response.json();
  return data.tracks.items;
}