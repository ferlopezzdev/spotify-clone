'use server';

import { cookies } from 'next/headers';
import axios, { isAxiosError } from 'axios';
import type { SpotifyUserProfile, SpotifyApiError } from '@/types/api-response/me.types';

export async function getUserProfile(): Promise<{ user?: SpotifyUserProfile; error?: string }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    return { error: 'No access token found. Please log in again.' };
  }

  try {
    const { data } = await axios.get<SpotifyUserProfile>('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return { user: data };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const apiError: SpotifyApiError = error.response.data;
      if (apiError.error.status === 401) {
        return { error: 'Token expired, authentication required.' };
      }
      return { error: `API Error: ${apiError.error.message}` };
    }
    return { error: 'Failed to fetch user data.' };
  }
}