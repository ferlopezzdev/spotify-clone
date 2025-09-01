'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function refreshAccessToken() {
    const refreshToken = (await cookies()).get('spotify_refresh_token')?.value;
  if (!refreshToken) {
    return null; // El usuario necesita volver a autenticarse
  }

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'post' as const,
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  };

  try {
    const { data } = await axios(authOptions);
    const { access_token } = data;
    (await cookies()).set('spotify_access_token', access_token, {
  httpOnly: true,
  path: '/',
  maxAge: 3600
});
    return access_token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
}
