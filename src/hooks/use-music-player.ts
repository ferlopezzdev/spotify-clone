"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSpotifyPlayer } from "@/hooks/use-spotify-player";
import { searchTracks } from "@/app/actions/search-track.action";
import { playTrack } from "@/app/actions/play-track.action";
import { transferPlayback } from "@/app/actions/transfer-playback.action";
import type { SpotifyTrack } from "@/types/api-response/search-tracks.types";

interface UseMusicPlayerOptions {
  accessToken: string;
}

export function useMusicPlayer({ accessToken }: UseMusicPlayerOptions) {
  const spotifyPlayer = useSpotifyPlayer(accessToken);

  const [isTransferred, setIsTransferred] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedSearchQuery.length > 2) {
        setIsSearching(true);
        try {
          const results = await searchTracks(debouncedSearchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching tracks:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery]);

  const handlePlayTrack = async (trackUri: string) => {
    if (!spotifyPlayer.deviceId) {
      console.error("No device ID available");
      return;
    }

    try {
      if (!isTransferred && spotifyPlayer.isReady) {
        await transferPlayback(spotifyPlayer.deviceId, false);
        setIsTransferred(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await playTrack(trackUri, spotifyPlayer.deviceId);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return {
    ...spotifyPlayer,

    searchQuery,
    searchResults,
    isSearching,

    handlePlayTrack,
    handleSearchChange,
    clearSearch,

    isTransferred,
  };
}
