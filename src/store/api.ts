import axios from 'axios';
import { makeAutoObservable } from 'mobx';

import { AlbumItem, Albums } from '../utils/interfaces';

class Api {
  SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
  SPOTIFY_URL = 'https://api.spotify.com/v1/';
  clientId = '1932a3a9fc3b4ec49c3594eb61f4b55a';
  scopes = 'user-read-email user-library-read';

  authorizeUrl(secret) {
    return (
      'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' +
      this.clientId +
      '&state=' +
      secret +
      (this.scopes ? '&scope=' + encodeURIComponent(this.scopes) : '') +
      '&redirect_uri=' +
      encodeURIComponent(`${this.SERVER_URL}/callback/`)
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
      const response = await axios.get(`${this.SERVER_URL}/refresh_token`, {
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
      const response = await axios.get(`${this.SERVER_URL}/account/${secret}`);

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
      const response = await axios.get<Albums>(`${this.SPOTIFY_URL}search`, {
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
      }>(`${this.SPOTIFY_URL}me/albums`, {
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
