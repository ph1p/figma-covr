
export interface Albums {
  albums: {
    href: string;
    items: AlbumItem[];
    limit: number;
    next: string;
    offset: number;
    previous: null;
    total: number;
  };
}

export type AlbumType = 'album' | 'compilation' | 'single';

export interface AlbumItem {
  album_type: AlbumType;
  artists: Artist[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: 'day' | 'year';
  total_tracks: number;
  type: AlbumType;
  uri: string;
}

export interface Artist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

export interface SpotifyUser {
  access_token: string | null;
  display_name: string | null;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: { href: string | null; total: number };
  href: string;
  id: string;
  images: {
    height: number | null;
    url: string;
    width: number | null;
  }[];
  refresh_token: string;
  type: string;
  uri: string;
}