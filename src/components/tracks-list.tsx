'use client';

import { Routes } from "@/stores/navigation-store";
import { Button } from "./ui/button";

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

interface RecentlyPlayedItem {
  track: Track;
}

interface LikedTrackItem {
  track: Track;
}

type TrackItem = RecentlyPlayedItem | LikedTrackItem;

interface TrackListProps {
  title: string;
  items: TrackItem[];
  isPlayerReady: boolean;
  onTrackPlay: (uri: string) => void;
  showViewAll?: boolean;
  maxItems?: number;
  currentTrackId?: string;
  isPlaying?: boolean;
  navigation?: Routes;
}

export default function TrackList({ 
  title, 
  items, 
  onTrackPlay,
  maxItems = 50,
  currentTrackId,
  isPlaying
}: TrackListProps) {
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
      <div className="flex items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      </div>
      
      <div className="flex flex-col">
        {displayItems.map((item, index) => {
          const track = getTrack(item);
          const isCurrent = currentTrackId === track.id;

          return (
            <div 
              key={`${track.id}-${index}`} 
              className={`group flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                isCurrent ? 'bg-green-500/10 text-green-400' : 'hover:bg-gray-800'
              }`}
              onClick={() => onTrackPlay(track.uri)}
            >
 
              <div className="relative w-8 text-center text-sm mr-4">
                <span className={`block transition-opacity ${isCurrent && isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                  {index + 1}
                </span>
              </div>

              <img
                src={track.album.images[2]?.url || track.album.images[1]?.url || track.album.images[0]?.url}
                alt={track.album.name}
                className="w-12 h-12 rounded-md object-cover mr-4"
              />

              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm truncate ${isCurrent ? 'text-green-400' : 'text-white'}`}>
                  {track.name}
                </h3>
                <p className={`text-xs truncate ${isCurrent ? 'text-green-400' : 'text-gray-400'}`}>
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