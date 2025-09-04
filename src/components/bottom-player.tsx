'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  MoreVertical 
} from 'lucide-react';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string; uri: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  duration_ms: number;
}

interface BottomPlayerProps {
  isReady: boolean;
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
}

export default function BottomPlayer({
  isReady,
  currentTrack,
  isPlaying,
  position,
  duration,
  volume,
  onTogglePlay,
  onSeek,
  onVolumeChange
}: BottomPlayerProps) {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800">
      {isReady && currentTrack ? (
        <div>
          <div className="px-4 py-1 bg-gray-900/50">
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatDuration(position)}
              </span>
              <Slider
                value={[position]}
                max={duration}
                step={1000}
                className="flex-1"
                onValueChange={([value]) => onSeek(value)}
              />
              <span className="text-xs text-gray-400 w-10">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center h-16 md:h-20 px-4 space-x-2 md:space-x-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <img
                src={currentTrack.album.images[0]?.url}
                alt={currentTrack.album.name}
                className="w-12 h-12 md:w-14 md:h-14 rounded"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{currentTrack.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {currentTrack.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Button
                className="bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10 md:w-12 md:h-12 p-0"
                onClick={onTogglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                ) : (
                  <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-2 flex-1 justify-end">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white md:hidden">
                <MoreVertical className="w-4 h-4" />
              </Button>
              
              <div className="hidden lg:flex items-center space-x-2 w-24">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  className="flex-1"
                  onValueChange={([value]) => onVolumeChange(value / 100)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-16 md:h-20 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-black fill-current" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm font-medium">
                {isReady ? 'Reproductor listo' : 'Conectando reproductor...'}
              </p>
              <p className="text-xs text-gray-400">
                {isReady ? 'Selecciona una canción para reproducir' : 'Iniciando Web Playback SDK...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}