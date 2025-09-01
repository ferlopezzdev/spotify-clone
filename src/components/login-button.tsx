'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Music } from 'lucide-react';

export function LoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      router.push('/api/auth/login');
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      size="lg"
      className="w-full cursor-pointer disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <Music className="mr-2 h-4 w-4" />
          Iniciar sesión con Spotify
        </>
      )}
    </Button>
  );
}