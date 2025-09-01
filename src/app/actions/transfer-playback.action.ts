'use server';

import { cookies } from 'next/headers';
import axios, { isAxiosError } from 'axios';
import type { SpotifyApiError } from '@/types/api-response/me.types';

export async function transferPlayback(
  deviceId: string, 
  play: boolean = false
): Promise<{ success?: boolean; error?: string }> {
  console.log('📱 Transferring playback to device:', deviceId);
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    console.log('❌ No access token found for transfer playback');
    return { error: 'No access token found.' };
  }

  try {
    await axios.put('https://api.spotify.com/v1/me/player', {
      device_ids: [deviceId],
      play: play
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('✅ Playback transferred successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Transfer playback error:', error);
    
    if (isAxiosError(error) && error.response) {
      console.log('📊 Error response status:', error.response.status);
      console.log('📊 Error response data:', error.response.data);
      
      const apiError: SpotifyApiError = error.response.data;
      return { error: `API Error: ${apiError.error.message}` };
    }
    return { error: 'Failed to transfer playback.' };
  }
}