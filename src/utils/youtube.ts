// YouTube API helper functions
import axios from 'axios';

interface YouTubeSearchResponse {
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
    };
  }[];
}

interface YouTubePlaylistResponse {
  id: string;
  snippet: {
    title: string;
  };
}

// Search for a video on YouTube
export const searchYouTubeVideo = async (accessToken: string, query: string): Promise<string | null> => {
  try {
    const response = await axios.get<YouTubeSearchResponse>('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 1,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (response.data.items && response.data.items.length > 0 && response.data.items[0].id) {
      return response.data.items[0].id.videoId;
    }
    
    return null;
  } catch (error) {
    console.error('Error searching for YouTube video:', error);
    throw error;
  }
};

// Create a YouTube playlist
export const createYouTubePlaylist = async (
  accessToken: string,
  title: string,
  description: string
): Promise<string> => {
  try {
    const response = await axios.post<YouTubePlaylistResponse>(
      'https://www.googleapis.com/youtube/v3/playlists',
      {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'private',
        },
      },
      {
        params: {
          part: 'snippet,status',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.id;
  } catch (error) {
    console.error('Error creating YouTube playlist:', error);
    throw error;
  }
};

// Add a video to a YouTube playlist
export const addVideoToPlaylist = async (
  accessToken: string,
  playlistId: string,
  videoId: string
): Promise<boolean> => {
  try {
    await axios.post(
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        snippet: {
          playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId,
          },
        },
      },
      {
        params: {
          part: 'snippet',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return true;
  } catch (error) {
    console.error('Error adding video to YouTube playlist:', error);
    return false;
  }
}; 