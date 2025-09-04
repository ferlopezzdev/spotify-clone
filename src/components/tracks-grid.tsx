// components/tracks/TrackGrid.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Routes, useNavigationStore } from '@/stores/navigation-store';
import { Play } from 'lucide-react';

// Interfaz genérica para cualquier track
interface Track {
  id: string;
  name: string;
  uri: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; height?: number; width?: number }[];
  };
}

// Tipos específicos para diferentes fuentes
interface RecentlyPlayedItem {
  track: Track;
}

interface LikedTrackItem {
  track: Track;
}


type TrackItem = RecentlyPlayedItem | LikedTrackItem;

interface TrackGridProps {
  title: string;
  items: TrackItem[];
  isPlayerReady: boolean;
  onTrackPlay: (uri: string) => void;
  showViewAll?: boolean;
  maxItems?: number;
  navigation?: Routes;
}

export default function TrackGrid({ 
  title, 
  items, 
  isPlayerReady, 
  onTrackPlay,
  showViewAll = false,
  navigation,
  maxItems = 12 
}: TrackGridProps) {
  
  const setNavigation = useNavigationStore((state) => state.setNavigation);

  const getTrack = (item: TrackItem): Track => {
    if ('track' in item) {
      return item.track;
    }
    return item;
  };

  const displayItems = items.slice(0, maxItems);

  if (!items.length) {
    return null;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {showViewAll && <Button variant='link' className='text-white' onClick={() => setNavigation(navigation as Routes)}>Ver todos</Button>}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {displayItems.map((item, index) => {
          const track = getTrack(item);
          return (
            <div 
              key={`${track.id}-${index}`} 
              className="group cursor-pointer" 
              onClick={() => onTrackPlay(track.uri)}
            >
              <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden mb-3">
                <img
                  src={track.album.images[1]?.url || track.album.images[0]?.url}
                  alt={track.album.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-400 text-black rounded-full w-10 h-10 md:w-12 md:h-12 p-0 scale-90 group-hover:scale-100 transition-transform"
                    disabled={!isPlayerReady}
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                  {track.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}