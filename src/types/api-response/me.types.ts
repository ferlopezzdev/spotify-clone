export interface SpotifyUserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null; // El href puede ser null
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  product: string;
  type: string;
  uri: string;
}

export interface SpotifyApiError {
  error: {
    status: number;
    message: string;
  };
}

export type SpotifyUserProfileResponse = SpotifyUserProfile | SpotifyApiError;