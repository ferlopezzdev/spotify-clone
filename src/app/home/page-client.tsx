'use client';

import { useMusicPlayer } from '@/hooks/use-music-player';
import { useNavigationStore } from '@/stores/navigation-store';

import { SpotifyUserProfile } from '@/types/api-response/me.types';

import Header from '@/components/header';
import WelcomeSection from '@/components/welcome-section';
import TrackGrid from '@/components/tracks-grid';
import BottomPlayer from '@/components/bottom-player';
import TrackList from '@/components/tracks-list';

import type { SpotifyRecentlyPlayed } from '@/app/actions/get-recently-played.action';
import type { SpotifySavedTracks } from '@/app/actions/get-liked-track.action';
import type { SpotifyCurrentlyPlaying } from '@/app/actions/get-currently-played.action';
import { Button } from '@/components/ui/button';
import { ArrowBigLeftDash, Backpack } from 'lucide-react';
import { useEffect } from 'react';
interface Props {
  user: SpotifyUserProfile;
  recentlyPlayed?: SpotifyRecentlyPlayed;
  currentlyPlaying?: SpotifyCurrentlyPlaying;
  likedTracks?: SpotifySavedTracks;
  accessToken: string;
}

export default function HomePageClient({ 
  user, 
  recentlyPlayed, 
  likedTracks, 
  accessToken 
}: Props) {
  const {
    isReady,
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,
    searchQuery,
    searchResults,
    handlePlayTrack,
    handleSearchChange,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume
  } = useMusicPlayer({ accessToken });

  const navigation = useNavigationStore((state) => state.navigation)
  const setNavigation = useNavigationStore((state) => state.setNavigation)


  useEffect(() => {
    console.log("NAVIGATION", navigation)
  }, [navigation])
  

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <div className="flex-1 overflow-auto pb-24 mt-16">
          {navigation === 'home' && <WelcomeSection user={user} isPlayerReady={isReady} />}
        
          {searchResults.length > 0 && (
            <TrackGrid
              title="Resultados de búsqueda"
              items={searchResults}
              isPlayerReady={isReady}
              onTrackPlay={handlePlayTrack}
              showViewAll={false}
            />
          )}

        {navigation === 'recently' && recentlyPlayed?.items && recentlyPlayed.items.length > 0 && (
          <div>
            <Button variant='link' className='ml-6 mt-6 cursor-pointer' onClick={() => setNavigation('home')}>
              <ArrowBigLeftDash  /> Volver
            </Button> 
          <TrackGrid
            title="Escuchado recientemente"
            items={recentlyPlayed.items}
            isPlayerReady={isReady}
            onTrackPlay={handlePlayTrack}
          />
          </div>
        )}
        
         {navigation === 'liked' && likedTracks?.items && likedTracks.items.length > 0 && (
           <div>
            <Button variant='link' className='ml-6 mt-6 cursor-pointer' onClick={() => setNavigation('home')}>
              <ArrowBigLeftDash  /> Volver
            </Button>
            <TrackList
            title="Canciones que te gustan"
            items={likedTracks.items}
            isPlayerReady={isReady}
            onTrackPlay={handlePlayTrack}
           />
           </div>
        )}

        </div>
      </div>

      <BottomPlayer
        isReady={isReady}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        position={position}
        duration={duration}
        volume={volume}
        onTogglePlay={togglePlay}
        onNextTrack={nextTrack}
        onPreviousTrack={previousTrack}
        onSeek={seek}
        onVolumeChange={setVolume}
      />
    </div>
  );
}