"use server";

import { cookies } from "next/headers";
import axios, { isAxiosError } from "axios";
import type { SpotifyApiError } from "@/types/api-response/me.types";

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  uri: string;
}

export interface SpotifyRecentlyPlayed {
  items: Array<{
    track: SpotifyTrack;
    played_at: string;
  }>;
  cursors: {
    after: string;
    before: string;
  };
}

// Función helper para filtrar duplicados manteniendo la reproducción más reciente
function removeDuplicateTracks(
  items: Array<{ track: SpotifyTrack; played_at: string }>
) {
  const seenTracks = new Map<
    string,
    { track: SpotifyTrack; played_at: string }
  >();

  // Iteramos en orden (del más reciente al más antiguo)
  // Si el track no existe en el Map, lo agregamos
  // Si ya existe, mantenemos el que ya estaba (que es más reciente)
  for (const item of items) {
    const trackId = item.track.id;

    if (!seenTracks.has(trackId)) {
      seenTracks.set(trackId, item);
    }
  }

  // Convertimos el Map de vuelta a array manteniendo el orden original
  return Array.from(seenTracks.values());
}

export async function getRecentlyPlayed(): Promise<{
  tracks?: SpotifyRecentlyPlayed;
  error?: string;
}> {
  console.log("🎵 Starting getRecentlyPlayed action...");

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    console.log("❌ No access token found for recently played");
    return { error: "No access token found." };
  }

  console.log("🔑 Access token found, making request...");

  try {
    // Solicitamos más elementos para asegurar que después del filtro tengamos suficientes
    const { data } = await axios.get<SpotifyRecentlyPlayed>(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(
      "✅ Recently played raw data fetched:",
      data.items?.length || 0,
      "items"
    );

    // Filtrar duplicados manteniendo solo la reproducción más reciente de cada canción
    const uniqueItems = removeDuplicateTracks(data.items || []);

    // Tomar solo los primeros 12 elementos únicos para mostrar
    const limitedItems = uniqueItems.slice(0, 12);

    console.log(
      "🎯 After removing duplicates:",
      limitedItems.length,
      "unique tracks"
    );

    // Crear el objeto de respuesta con los elementos filtrados
    const filteredData: SpotifyRecentlyPlayed = {
      items: limitedItems,
      cursors: data.cursors,
    };

    return { tracks: filteredData };
  } catch (error) {
    console.error("❌ Recently played error:", error);

    if (isAxiosError(error) && error.response) {
      console.log("📊 Error response status:", error.response.status);
      console.log("📊 Error response data:", error.response.data);

      const apiError: SpotifyApiError = error.response.data;
      return { error: `API Error: ${apiError.error.message}` };
    }
    return { error: "Failed to fetch recently played tracks." };
  }
}
