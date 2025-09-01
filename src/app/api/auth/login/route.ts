import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

function generateRandomString(length: number) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export async function GET() {
  if (!CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  const state = generateRandomString(16);
const scope = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-modify-playback-state',
  'streaming',
  'user-library-read' // ⭐️ ¡El nuevo scope que necesitas!
].join(' ');
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state,
  });

  // ⭐️ La URL de redirección debe ser la URL oficial de Spotify
  const response = NextResponse.redirect(`https://accounts.spotify.com/authorize?` + params.toString());
  
  response.cookies.set('spotify_auth_state', state, {
    httpOnly: true,
    path: '/',
  });
  
  return response;
}