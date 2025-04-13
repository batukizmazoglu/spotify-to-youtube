// Spotify API helper functions
import axios from 'axios';

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

// For making requests to Spotify API
export const fetchSpotifyPlaylists = async (accessToken: string): Promise<SpotifyPlaylist[]> => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error retrieving Spotify playlists:', error);
    throw error;
  }
};

// Get tracks from a Spotify playlist
export const fetchPlaylistTracks = async (accessToken: string, playlistId: string): Promise<{
  track: {
    name: string;
    artists: {
      name: string;
    }[];
  };
}[]> => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(`Error retrieving playlist tracks (${playlistId}):`, error);
    throw error;
  }
};

// Create Spotify OAuth URL
export const getSpotifyAuthUrl = (clientId: string, redirectUri: string): string => {
  const scope = 'playlist-read-private playlist-read-collaborative';
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;
};

// Get Spotify access token
export const getSpotifyToken = async (
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<SpotifyTokenResponse> => {
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
    });
    return tokenResponse.data;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
}; 