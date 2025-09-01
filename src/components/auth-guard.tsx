import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/app/actions/get-user-profile.action';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    redirect('/');
  }

  const result = await getUserProfile();

  if (result.error || !result.user) {
    redirect('/');
  }

  return children;
}