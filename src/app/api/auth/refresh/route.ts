// app/api/auth/refresh/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
  const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token available' }, { status: 401 });
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

    const response = new NextResponse();
    response.cookies.set('spotify_access_token', access_token, { httpOnly: true, path: '/', maxAge: 3600 });

    return response;
  } catch (error) {
    // Si el refresh token falla, el usuario debe volver a autenticarse
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return NextResponse.json({ error: 'Refresh token expired or invalid' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}