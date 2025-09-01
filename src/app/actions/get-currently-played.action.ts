'use server';

import { cookies } from 'next/headers';
import axios, { isAxiosError } from 'axios';
import type { SpotifyApiError } from '@/types/api-response/me.types';
import type { SpotifyTrack } from './get-recently-played.action';

export interface SpotifyCurrentlyPlaying {
  device: {
    id: string;
    is_active: boolean;
    name: string;
    type: string;
    volume_percent: number;
  };
  shuffle_state: boolean;
  repeat_state: string;
  timestamp: number;
  context: {
    type: string;
    href: string;
    uri: string;
  } | null;
  progress_ms: number;
  item: SpotifyTrack | null;
  currently_playing_type: string;
  is_playing: boolean;
}

export async function getCurrentlyPlaying(): Promise<{ playing?: SpotifyCurrentlyPlaying; error?: string }> {
  console.log('🎧 Starting getCurrentlyPlaying action...');
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    console.log('❌ No access token found for currently playing');
    return { error: 'No access token found.' };
  }

  console.log('🔑 Access token found, making request...');

  try {
    const { data } = await axios.get<SpotifyCurrentlyPlaying>('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    console.log('✅ Currently playing data fetched:', data?.item ? 'playing' : 'no active playback');
    return { playing: data };
  } catch (error) {
    console.error('❌ Currently playing error:', error);
    
    if (isAxiosError(error) && error.response) {
      console.log('📊 Error response status:', error.response.status);
      console.log('📊 Error response data:', error.response.data);
      
      if (error.response.status === 204) {
        console.log('ℹ️ No content - usuario no está reproduciendo nada');
        return { playing: undefined };
      }
      const apiError: SpotifyApiError = error.response.data;
      return { error: `API Error: ${apiError.error.message}` };
    }
    return { error: 'Failed to fetch currently playing.' };
  }
}