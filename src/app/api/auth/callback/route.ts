// app/api/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  const storedState = request.cookies.get('spotify_auth_state')?.value;
  if (state === null || state !== storedState || code === null) {
    return NextResponse.redirect(new URL('/#error=state_mismatch', request.url));
  }

  // Get the origin of the current request (e.g., http://127.0.0.1:3000)
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  // ⭐️ Corregido: Create the redirection response with the correct origin
  const response = NextResponse.redirect(new URL('/home', 'http://127.0.0.1:3000'));
  response.cookies.delete('spotify_auth_state');

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'post' as const,
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams({
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString(),
  };

  try {
    const { data } = await axios(authOptions);
    const { access_token, refresh_token } = data;

    response.cookies.set('spotify_access_token', access_token, { httpOnly: true, path: '/', maxAge: 3600 });
    response.cookies.set('spotify_refresh_token', refresh_token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: 'Token exchange failed' }, { status: error.response?.status || 500 });
    } else {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}