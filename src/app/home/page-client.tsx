'use client';
import { useEffect, useState } from 'react';
import { useTransition } from 'react';
import { logout } from '@/app/actions/logout.action';
import { searchTracks } from '@/app/actions/search-track.action';
import { Input } from '@/components/ui/input';

import { SpotifyUserProfile } from '@/types/api-response/me.types';
import { playTrack } from '@/app/actions/play-track.action';
import { transferPlayback } from '@/app/actions/transfer-playback.action';
import { useSpotifyPlayer } from '@/hooks/use-spotify-player';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Users, Crown, Heart, Volume2, Pause, SkipForward, SkipBack, Shuffle, Repeat, Clock, Menu, Search, MoreVertical, Home, Library } from 'lucide-react';
import type { SpotifyTrack } from '@/types/api-response/search-tracks.types';
import type { SpotifyRecentlyPlayed } from '@/app/actions/get-recently-played.action';
import type { SpotifySavedTracks } from '@/app/actions/get-liked-track.action';
import type { SpotifyCurrentlyPlaying } from '@/app/actions/get-currently-played.action';
import { useDebounce } from '@/hooks/use-debounce';

interface Props {
  user: SpotifyUserProfile;
  recentlyPlayed?: SpotifyRecentlyPlayed;
  currentlyPlaying?: SpotifyCurrentlyPlaying;
  likedTracks?: SpotifySavedTracks;
  accessToken: string;
}

export default function HomePageClient({ user, recentlyPlayed, likedTracks, accessToken }: Props) {
  const {
    deviceId,
    isReady,
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume
  } = useSpotifyPlayer(accessToken);

  const [isPending, startTransition] = useTransition();
  const [isTransferred, setIsTransferred] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedSearchQuery.length > 2) {
        try {
          const results = await searchTracks(debouncedSearchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching tracks:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery]);

  const handlePlayTrack = async (trackUri: string) => {
    if (!deviceId) {
      console.error('No device ID available');
      return;
    }

    try {
      if (!isTransferred && isReady) {
        await transferPlayback(deviceId, false);
        setIsTransferred(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await playTrack(trackUri, deviceId);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 md:z-auto
        w-64 bg-gray-950 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 md:p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-black fill-current" />
            </div>
            <span className="text-xl font-bold text-green-400">Spotify</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start h-10 px-3 bg-green-600/20 text-white">
              <Home className="w-5 h-5 mr-3" />
              Inicio
            </Button>
            <Button variant="ghost" className="w-full justify-start h-10 px-3 text-gray-300 hover:text-white hover:bg-gray-800">
              <Search className="w-5 h-5 mr-3" />
              Buscar
            </Button>
            <Button variant="ghost" className="w-full justify-start h-10 px-3 text-gray-300 hover:text-white hover:bg-gray-800">
              <Library className="w-5 h-5 mr-3" />
              Tu biblioteca
            </Button>
          </div>
          
          <div className="pt-6 border-t border-gray-800 mt-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-3">
              Creada por ti
            </h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start h-10 px-3 text-gray-300 hover:text-white hover:bg-gray-800">
                <Heart className="w-5 h-5 mr-3" />
                Canciones que te gustan
              </Button>
              <Button variant="ghost" className="w-full justify-start h-10 px-3 text-gray-300 hover:text-white hover:bg-gray-800">
                <Clock className="w-5 h-5 mr-3" />
                Reproducidos recientemente
              </Button>
            </div>
          </div>
        </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.images[0]?.url} />
            <AvatarFallback className="bg-green-500 text-black text-xs">
              {getInitials(user.display_name || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.display_name}</p>
            {user.product === 'premium' && (
              <div className="flex items-center">
                <Crown className="w-3 h-3 text-yellow-400 mr-1" />
                <span className="text-xs text-gray-400">Premium</span>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        {/* Header */}
<div className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 md:px-6">
  <div className="flex items-center space-x-4 flex-1">
    <Button 
      variant="ghost" 
      size="sm" 
      className="md:hidden text-gray-400 hover:text-white"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <Menu className="w-5 h-5" />
    </Button>
    <div className="hidden sm:block text-xl md:text-2xl font-bold">Inicio</div>
    <div className="flex-1 max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar canciones, artistas o podcasts"
          className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border-gray-700 focus:border-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  </div>

  <div className="flex items-center space-x-2 md:space-x-4">
    <Avatar className="w-8 h-8">
      <AvatarImage src={user.images[0]?.url} />
      <AvatarFallback className="bg-green-500 text-black text-xs">
        {getInitials(user.display_name || 'U')}
      </AvatarFallback>
    </Avatar>
  </div>
</div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto pb-24">
          {/* Welcome Section */}
          <div className="p-4 md:p-6 bg-gradient-to-b from-green-900/20 to-transparent">
            <div className="max-w-6xl">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                Buenas tardes, {user.display_name}
              </h1>
              <p className="text-gray-400 mb-6">
                Aquí tienes tu música personalizada
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{user.followers.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Seguidores</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <Crown className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold capitalize">{user.product}</p>
                      <p className="text-xs text-gray-400">Plan</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {isReady ? 'Activo' : 'Conectando...'}
                      </p>
                      <p className="text-xs text-gray-400">Reproductor Web</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {searchResults.length > 0 && (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Resultados de búsqueda</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {searchResults.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="group cursor-pointer" 
            onClick={() => handlePlayTrack(item.uri)}>
            <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden mb-3">
              <img
                src={item.album.images[1]?.url || item.album.images[0]?.url}
                alt={item.album.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-400 text-black rounded-full w-10 h-10 md:w-12 md:h-12 p-0 scale-90 group-hover:scale-100 transition-transform"
                  disabled={!isReady}
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                {item.name}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-1">
                {item.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}


          {/* Recently Played */}
          {recentlyPlayed && recentlyPlayed.items && recentlyPlayed.items.length > 0 && (
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Escuchado recientemente</h2>
                <Button variant="link" size="sm" className="text-gray-400 hover:text-white hidden sm:block">
                  Mostrar todo
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {recentlyPlayed.items.slice(0, 12).map((item, index) => (
                  <div 
                  key={`${item.track.id}-${index}`} 
                  className="group cursor-pointer" 
                  onClick={() => handlePlayTrack(item.track.uri)}>
                    <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden mb-3">
                      <img
                        src={item.track.album.images[1]?.url || item.track.album.images[0]?.url}
                        alt={item.track.album.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-400 text-black rounded-full w-10 h-10 md:w-12 md:h-12 p-0 scale-90 group-hover:scale-100 transition-transform"
                          disabled={!isReady}
                        >
                          <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                        {item.track.name}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {item.track.artists.map(artist => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

            {/* Liked Tracks Section */}
      {likedTracks && likedTracks.items && likedTracks.items.length > 0 && (
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Canciones que te gustan</h2>
            <Button variant="link" size="sm" className="text-gray-400 hover:text-white hidden sm:block">
              Mostrar todo
            </Button>
          </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {likedTracks.items.slice(0, 12).map((item, index) => (
            <div key={`${item.track.id}-${index}`} className="group cursor-pointer" onClick={() => handlePlayTrack(item.track.uri)}>
              <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden mb-3">
                <img
                  src={item.track.album.images[1]?.url || item.track.album.images[0]?.url}
                  alt={item.track.album.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-400 text-black rounded-full w-10 h-10 md:w-12 md:h-12 p-0 scale-90 group-hover:scale-100 transition-transform"
                    disabled={!isReady}
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                  {item.track.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {item.track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

          
        </div>
      </div>

      {/* Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 h-20 md:h-24">
        {isReady && currentTrack ? (
          <div className="flex items-center h-full px-4 space-x-2 md:space-x-4">
            {/* Track Info */}
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
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hidden sm:block">
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center flex-1 max-w-lg">
              <div className="flex items-center space-x-2 md:space-x-4 mb-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hidden md:block">
                  <Shuffle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={previousTrack}
                >
                  <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button
                  className="bg-white text-black hover:bg-gray-200 rounded-full w-8 h-8 md:w-10 md:h-10 p-0"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={nextTrack}
                >
                  <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hidden md:block">
                  <Repeat className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="hidden md:flex items-center space-x-2 w-full">
                <span className="text-xs text-gray-400 w-10 text-right">
                  {formatDuration(position)}
                </span>
                <Slider
                  value={[position]}
                  max={duration}
                  step={1000}
                  className="flex-1"
                  onValueChange={([value]) => seek(value)}
                />
                <span className="text-xs text-gray-400 w-10">
                  {formatDuration(duration)}
                </span>
              </div>
            </div>

            {/* Right Controls */}
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
                  onValueChange={([value]) => setVolume(value / 100)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full px-4">
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
    </div>
  );
}