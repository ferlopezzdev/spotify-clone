import { getUserProfile } from '../actions/get-user-profile.action';
import { getRecentlyPlayed } from '../actions/get-recently-played.action';
import { getCurrentlyPlaying } from '../actions/get-currently-played.action';
import { getLikedTracks } from '../actions/get-liked-track.action';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import HomePageClient from './page-client';

import type { SpotifySavedTracks } from '../actions/get-liked-track.action';

export default async function HomePage() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;
    
    if (!accessToken) {
      console.error('No access token found');
      redirect('/');
    }

    const { user, error: userError } = await getUserProfile();
    
    if (userError || !user) {
      console.error('User error:', userError);
      redirect('/');
    }

    const [recentlyPlayedResult, currentlyPlayingResult, likedTracksResult] = await Promise.allSettled([
      getRecentlyPlayed(),
      getCurrentlyPlaying(),
      getLikedTracks(),
    ]);

    let recentlyPlayed = undefined;
    let currentlyPlaying = undefined;
    let likedTracks: SpotifySavedTracks | undefined = undefined;

    if (recentlyPlayedResult.status === 'fulfilled' && recentlyPlayedResult.value.tracks) {
      recentlyPlayed = recentlyPlayedResult.value.tracks;
    } else if (recentlyPlayedResult.status === 'rejected') {
      console.error('Recently played error:', recentlyPlayedResult.reason);
    }

    if (currentlyPlayingResult.status === 'fulfilled' && currentlyPlayingResult.value.playing) {
      currentlyPlaying = currentlyPlayingResult.value.playing;
    } else if (currentlyPlayingResult.status === 'rejected') {
      console.error('Currently playing error:', currentlyPlayingResult.reason);
    }
    
    if (likedTracksResult.status === 'fulfilled' && likedTracksResult.value.tracks) {
      likedTracks = likedTracksResult.value.tracks;
    } else if (likedTracksResult.status === 'rejected') {
      console.error('Liked tracks error:', likedTracksResult.reason);
    }

    return (
      <HomePageClient 
        user={user}
        recentlyPlayed={recentlyPlayed}
        currentlyPlaying={currentlyPlaying}
        likedTracks={likedTracks} 
        accessToken={accessToken}
      />
    );
  } catch (error) {
    console.error('Page error:', error);
    redirect('/');
  }
}