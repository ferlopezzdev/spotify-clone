import { create } from "zustand";

export type Routes =
  | "home"
  | "liked"
  | "playlist"
  | "recently"
  | "playlist-detail";

interface NavigationState {
  navigation: Routes;
  currentPlaylistId: string | null;
  setNavigation: (page: Routes) => void;
  setCurrentPlaylist: (playlistId: string | null) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  navigation: "home",
  currentPlaylistId: null,
  setNavigation: (page) => set({ navigation: page }),
  setCurrentPlaylist: (playlistId) => set({ currentPlaylistId: playlistId }),
}));
