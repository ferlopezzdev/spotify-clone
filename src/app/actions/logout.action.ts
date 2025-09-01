'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  const cookieStore = await cookies();
 cookieStore.delete('spotify_access_token');
  cookieStore.delete('spotify_refresh_token');

  redirect('/');
}