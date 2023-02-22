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

export interface ShowItem {
  id: string;
  publisher: string;
  artists: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
}

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

export interface FollowingItem {
  external_urls: {
    spotify: string;
  };
  followers: {
    href?: any;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface Followings {
  items: FollowingItem[];
  next: string;
  total: number;
  cursors: {
    after: string;
  };
  limit: number;
  href: string;
}

export interface Playlists {
  href: string;
  items: Playlist[];
  limit: number;
  next?: string;
  offset: number;
  previous?: string;
  total: number;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height?: number;
    url: string;
    width?: number;
  }[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}
