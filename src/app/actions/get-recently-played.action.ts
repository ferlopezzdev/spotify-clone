'use server';

import { cookies } from 'next/headers';
import axios, { isAxiosError } from 'axios';
import type { SpotifyApiError } from '@/types/api-response/me.types';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  uri: string
}

export interface SpotifyRecentlyPlayed {
  items: Array<{
    track: SpotifyTrack;
    played_at: string;
  }>;
  cursors: {
    after: string;
    before: string;
  };
}

export async function getRecentlyPlayed(): Promise<{ tracks?: SpotifyRecentlyPlayed; error?: string }> {
  console.log('🎵 Starting getRecentlyPlayed action...');
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    console.log('❌ No access token found for recently played');
    return { error: 'No access token found.' };
  }

  console.log('🔑 Access token found, making request...');

  try {
    const { data } = await axios.get<SpotifyRecentlyPlayed>('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    console.log('✅ Recently played data fetched:', data.items?.length || 0, 'items');
    return { tracks: data };
  } catch (error) {
    console.error('❌ Recently played error:', error);
    
    if (isAxiosError(error) && error.response) {
      console.log('📊 Error response status:', error.response.status);
      console.log('📊 Error response data:', error.response.data);
      
      const apiError: SpotifyApiError = error.response.data;
      return { error: `API Error: ${apiError.error.message}` };
    }
    return { error: 'Failed to fetch recently played tracks.' };
  }
}