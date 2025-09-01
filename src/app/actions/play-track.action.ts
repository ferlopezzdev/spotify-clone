'use server';

import { cookies } from 'next/headers';
import axios, { isAxiosError } from 'axios';
import type { SpotifyApiError } from '@/types/api-response/me.types';

export async function playTrack(
  trackUri: string, 
  deviceId?: string
): Promise<{ success?: boolean; error?: string }> {
  console.log('🎵 Starting playTrack action...', { trackUri, deviceId });
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    console.log('❌ No access token found for play track');
    return { error: 'No access token found.' };
  }

  try {
    const url = `https://api.spotify.com/v1/me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`;
    
    await axios.put(url, {
      uris: [trackUri]
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('✅ Track started playing successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Play track error:', error);
    
    if (isAxiosError(error) && error.response) {
      console.log('📊 Error response status:', error.response.status);
      console.log('📊 Error response data:', error.response.data);
      
      const apiError: SpotifyApiError = error.response.data;
      return { error: `API Error: ${apiError.error.message}` };
    }
    return { error: 'Failed to play track.' };
  }
}