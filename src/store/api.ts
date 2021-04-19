import axios from 'axios';
import { makeAutoObservable } from 'mobx';

import {
  SERVER_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SCOPES,
  SPOTIFY_API_URL,
} from '../utils/constants';
import { AlbumItem, Albums } from '../utils/interfaces';

class Api {
  generateAuthorizeUrl(secret) {
    return (
      'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' +
      SPOTIFY_CLIENT_ID +
      '&state=' +
      secret +
      (SPOTIFY_SCOPES ? '&scope=' + encodeURIComponent(SPOTIFY_SCOPES) : '') +
      '&redirect_uri=' +
      encodeURIComponent(`${SERVER_URL}/callback/`)
    );
  }

  constructor(private store, newAccessToken: (at: string) => void) {
    makeAutoObservable(this);

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 400) {
          return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const access_token = await this.getNewAccessToken(
            this.store.user.refresh_token
          );

          if (access_token) {
            newAccessToken(access_token);

            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

            return axios(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async getNewAccessToken(refreshToken) {
    try {
      const response = await axios.get(`${SERVER_URL}/refresh_token`, {
        params: {
          refresh_token: refreshToken,
        },
      });

      return response.data.access_token;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getUserTokenFromServer(secret: string) {
    try {
      const response = await axios.get(`${SERVER_URL}/account/${secret}`);

      if (!response.data.waiting) {
        return response.data;
      }

      return null;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAlbums(searchTerm: string): Promise<AlbumItem[]> {
    try {
      const response = await axios.get<Albums>(`${SPOTIFY_API_URL}search`, {
        params: {
          q: searchTerm,
          type: 'album',
        },
        headers: {
          Authorization: `Bearer ${this.store.user.access_token}`,
        },
      });

      return response.data.albums.items.filter(
        (album) => album.images.length > 0
      );
    } catch (e) {
      return Promise.reject(e?.response?.data || 'Unknown error');
    }
  }

  async getLibraryAlbums(): Promise<AlbumItem[]> {
    try {
      const response = await axios.get<{
        items: {
          album: AlbumItem;
        }[];
      }>(`${SPOTIFY_API_URL}me/albums`, {
        params: {
          limit: 50,
        },
        headers: {
          Authorization: `Bearer ${this.store.user.access_token}`,
        },
      });

      return response.data.items
        .map((item) => item.album)
        .filter((album) => album.images.length > 0);
    } catch (e) {
      return Promise.reject(e?.response?.data || 'Unknown error');
    }
  }
}

export default Api;
