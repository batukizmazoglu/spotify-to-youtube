'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchSpotifyPlaylists, fetchPlaylistTracks } from '@/utils/spotify';
import { createYouTubePlaylist, searchYouTubeVideo, addVideoToPlaylist } from '@/utils/youtube';
import Image from 'next/image';

interface Playlist {
  id: string;
  name: string;
  images?: { url: string }[]; // images array may be optional
  tracks: { total: number };
  owner: { display_name: string };
}

export default function PlaylistList() {
  const { spotifyToken, youtubeToken } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [transferProgress, setTransferProgress] = useState<{
    current: number;
    total: number;
    playlistName: string;
  } | null>(null);

  // Load Spotify playlists
  useEffect(() => {
    const loadPlaylists = async () => {
      if (!spotifyToken) {
        setError('No Spotify access token. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const playlistData = await fetchSpotifyPlaylists(spotifyToken);
        setPlaylists(playlistData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading playlists:', err);
        setError('Could not load playlists. Please try again later.');
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [spotifyToken]);

  // Toggle playlist selection state
  const togglePlaylist = (playlistId: string) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlistId)
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  // Add transfer function
  const transferSelectedPlaylists = async () => {
    if (!spotifyToken) {
      setError('No Spotify access token. Please log in again.');
      return;
    }
    
    if (!youtubeToken) {
      setError('No YouTube access token. Please log in again.');
      return;
    }
    
    try {
      // Transfer process is starting
      setLoading(true);
      setError(null);
      setTransferProgress(null);
      
      console.log('Checking token type...');
      // Add token format check
      if (typeof window !== 'undefined') {
        // Check auth header in localStorage
        const authHeader = localStorage.getItem('google_auth_header');
        if (!authHeader) {
          console.log('Auth header not found, creating...');
          localStorage.setItem('google_auth_header', `Bearer ${youtubeToken}`);
        }
      }
      
      // Loop for selected playlists
      for (const playlistId of selectedPlaylists) {
        // Find current playlist
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) continue;
        
        // Update progress indicator
        setTransferProgress({
          current: 0,
          total: playlist.tracks.total,
          playlistName: playlist.name
        });
        
        // Get playlist tracks
        const tracks = await fetchPlaylistTracks(spotifyToken, playlistId);
        console.log(`Retrieved ${tracks.length} songs from playlist ${playlist.name}`);
        
        // Create new playlist on YouTube
        const youtubePlaylistId = await createYouTubePlaylist(
          youtubeToken,
          `${playlist.name} (Transferred from Spotify)`,
          `This playlist was automatically transferred from Spotify.`
        );
        
        // Search for each song on YouTube and add to playlist
        let successfulTransfers = 0;
        const failedTransfers: string[] = []; // Array to hold failed transfers
        
        for (let i = 0; i < tracks.length; i++) {
          const item = tracks[i];
          if (!item.track) {
            console.log(`Item ${i+1} is not a valid track, skipping`);
            continue;
          }
          
          // Update progress
          setTransferProgress({
            current: i + 1,
            total: tracks.length,
            playlistName: playlist.name
          });
          
          try {
            // Create search query for the song
            const artistNames = item.track.artists.map((a: { name: string }) => a.name).join(' ');
            const searchQuery = `${item.track.name} ${artistNames}`;
            console.log(`Searching song (${i+1}/${tracks.length}): "${item.track.name}" - ${artistNames}`);
            
            // Search on YouTube
            const videoId = await searchYouTubeVideo(youtubeToken, searchQuery);
            
            // If video found, add to playlist
            if (videoId) {
              // Short delay to limit API request rate
              await new Promise(resolve => setTimeout(resolve, 500));
              
              const result = await addVideoToPlaylist(youtubeToken, youtubePlaylistId, videoId);
              if (result) {
                successfulTransfers++;
                console.log(`Song added (${successfulTransfers}/${tracks.length}): ${item.track.name}`);
              } else {
                failedTransfers.push(`${item.track.name} - ${artistNames}`);
                console.error(`Failed to add song: ${item.track.name}`);
              }
            } else {
              failedTransfers.push(`${item.track.name} - ${artistNames}`);
              console.log(`Song not found: ${item.track.name}`);
            }
          } catch (error) {
            failedTransfers.push(`${item.track.name} - ${item.track.artists.map((a: { name: string }) => a.name).join(' ')}`);
            console.error(`Error transferring song: ${item.track.name}`, error);
          }
        }
        
        // Log failed songs
        if (failedTransfers.length > 0) {
          console.log(`\n${failedTransfers.length} songs could not be transferred:`);
          failedTransfers.forEach((song, index) => {
            console.log(`${index + 1}. ${song}`);
          });
        }
        
        console.log(`Transfer complete for ${playlist.name}. Successfully transferred ${successfulTransfers}/${tracks.length} songs.`);
      }
      
      // Process complete
      setLoading(false);
      setTransferProgress(null);
      alert("Playlists successfully transferred to YouTube!");
      
      // Clear selections
      setSelectedPlaylists([]);
    } catch (err) {
      console.error('Error during transfer:', err);
      setError('An error occurred while transferring playlists. Please try again later.');
      setLoading(false);
      setTransferProgress(null);
    }
  };

  if (loading && !transferProgress) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (transferProgress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-white text-center">
          Aktarılıyor: {transferProgress.playlistName}
        </h3>
        
        <div className="w-full max-w-md mb-4 sm:mb-6 px-2">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>İlerleme</span>
            <span>{Math.round((transferProgress.current / transferProgress.total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
            <div 
              className="bg-blue-600 h-3 sm:h-4 rounded-full transition-all duration-500 flex items-center justify-center text-xs text-white"
              style={{ width: `${Math.max(5, Math.round((transferProgress.current / transferProgress.total) * 100))}%` }}
            >
              {transferProgress.current > transferProgress.total / 4 && `${transferProgress.current}/${transferProgress.total}`}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
            {transferProgress.current} / {transferProgress.total} şarkı aktarıldı
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Bu işlem biraz zaman alabilir. Lütfen sayfayı kapatmayın.
          </p>
        </div>
        
        <div className="mt-6 sm:mt-8 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-3 sm:px-4 sm:py-3 rounded text-sm sm:text-base">
        <p>{error}</p>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-3 sm:px-4 sm:py-3 rounded text-sm sm:text-base">
        <p>Hiç çalma listeniz yok veya bu uygulamaya erişim izni vermediniz.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
        Spotify Çalma Listeleriniz
      </h2>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedPlaylists(playlists.map(p => p.id))}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Tümünü Seç
        </button>
        <button
          onClick={() => setSelectedPlaylists([])}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-md transition-colors"
        >
          Seçimi Temizle
        </button>
        {selectedPlaylists.length > 0 && (
          <button
            onClick={transferSelectedPlaylists}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white rounded-md ml-auto transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
            </svg>
            {selectedPlaylists.length} Çalma Listesini Aktar
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            onClick={() => togglePlaylist(playlist.id)}
            className={`border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer ${
              selectedPlaylists.includes(playlist.id)
                ? 'border-blue-500 shadow-md bg-blue-50 dark:bg-blue-900/20 transform scale-[1.02]'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <div className="flex p-3 sm:p-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-4 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 relative">
                {playlist.images && playlist.images.length > 0 ? (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 48px, 64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">{playlist.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {playlist.tracks.total} şarkı • {playlist.owner.display_name}
                </p>
                <div className="mt-1.5 sm:mt-2 flex items-center">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-md mr-1.5 sm:mr-2 transition-colors ${
                    selectedPlaylists.includes(playlist.id) ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {selectedPlaylists.includes(playlist.id) ? 'Aktarım için seçildi' : 'Aktarmak için seçin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPlaylists.length > 0 && (
        <div className="mt-4 sm:mt-6 sticky bottom-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-center sm:text-left">
              <span className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">{selectedPlaylists.length} çalma listesi</span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1 sm:ml-2">aktarım için seçildi</span>
            </div>
            <button
              onClick={transferSelectedPlaylists}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
              </svg>
              Aktarımı Başlat
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 