'use client';

import { Heart, Music } from 'lucide-react';
import { SpotifyUserProfile } from '@/types/api-response/me.types';
import { useNavigationStore } from '@/stores/navigation-store';

interface WelcomeSectionProps {
  user: SpotifyUserProfile;
  isPlayerReady: boolean;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Buenos días';
  } else if (hour >= 12 && hour < 19) {
    return 'Buenas tardes';
  } else {
    return 'Buenas noches';
  }
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  const { setNavigation } = useNavigationStore();

  const greeting = getTimeGreeting(); 

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-green-900/20 to-transparent">
      <div className="max-w-6xl">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
          {greeting}, {user.display_name}
        </h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div onClick={() => setNavigation('liked')} className="bg-gray-900/50 rounded-lg p-4 mt-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-400/80 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill='white' />
              </div>
              <div>
                <p className="text-lg font-bold">Tus me gusta</p>
              </div>
            </div>
          </div>

          <div onClick={() => setNavigation('recently')} className="bg-gray-900/50 rounded-lg p-4 mt-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/80 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" fill='white' />
              </div>
              <div>
                <p className="text-lg font-bold">Esuchados recientemente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}