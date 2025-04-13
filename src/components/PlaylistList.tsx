'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchSpotifyPlaylists, fetchPlaylistTracks } from '@/utils/spotify';
import { createYouTubePlaylist, searchYouTubeVideo, addVideoToPlaylist } from '@/utils/youtube';
import Image from 'next/image';

interface Playlist {
  id: string;
  name: string;
  images?: { url: string }[]; // images dizisi opsiyonel olabilir
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

  // Spotify çalma listelerini yükle
  useEffect(() => {
    const loadPlaylists = async () => {
      if (!spotifyToken) {
        setError('Spotify erişim tokeni yok. Lütfen tekrar giriş yapın.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const playlistData = await fetchSpotifyPlaylists(spotifyToken);
        setPlaylists(playlistData);
        setLoading(false);
      } catch (err) {
        console.error('Çalma listeleri yüklenirken hata oluştu:', err);
        setError('Çalma listeleri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [spotifyToken]);

  // Çalma listesi seçim durumunu değiştir
  const togglePlaylist = (playlistId: string) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlistId)
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  // Aktarma fonksiyonu ekleyelim
  const transferSelectedPlaylists = async () => {
    if (!spotifyToken) {
      setError('Spotify erişim tokeni yok. Lütfen tekrar giriş yapın.');
      return;
    }
    
    if (!youtubeToken) {
      setError('YouTube erişim tokeni yok. Lütfen tekrar giriş yapın.');
      return;
    }
    
    try {
      // Aktarma işlemi başlıyor
      setLoading(true);
      setError(null);
      setTransferProgress(null);
      
      console.log('Token tipini kontrol ediyorum...');
      // Token formatı kontrolü ekle
      if (typeof window !== 'undefined') {
        // localStorage'dan auth header'ı kontrol et
        const authHeader = localStorage.getItem('google_auth_header');
        if (!authHeader) {
          console.log('Auth header bulunamadı, oluşturuluyor...');
          localStorage.setItem('google_auth_header', `Bearer ${youtubeToken}`);
        }
      }
      
      // Seçilen çalma listeleri için döngü
      for (const playlistId of selectedPlaylists) {
        // Şu anki çalma listesini bul
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) continue;
        
        // İlerleme göstergesini güncelleyelim
        setTransferProgress({
          current: 0,
          total: playlist.tracks.total,
          playlistName: playlist.name
        });
        
        // Çalma listesi şarkılarını getir
        const tracks = await fetchPlaylistTracks(spotifyToken, playlistId);
        console.log(`${playlist.name} çalma listesinden ${tracks.length} şarkı alındı`);
        
        // YouTube'da yeni çalma listesi oluştur
        const youtubePlaylistId = await createYouTubePlaylist(
          youtubeToken,
          `${playlist.name} (Spotify'dan aktarıldı)`,
          `Bu çalma listesi Spotify'dan otomatik olarak aktarılmıştır.`
        );
        
        // Her şarkı için YouTube'da arama yapıp çalma listesine ekle
        let successfulTransfers = 0;
        const failedTransfers: string[] = []; // Başarısız aktarımları tutacak dizi
        
        for (let i = 0; i < tracks.length; i++) {
          const item = tracks[i];
          if (!item.track) {
            console.log(`${i+1}. öğe geçerli bir şarkı değil, atlanıyor`);
            continue;
          }
          
          // İlerlemeyi güncelle
          setTransferProgress({
            current: i + 1,
            total: tracks.length,
            playlistName: playlist.name
          });
          
          try {
            // Şarkı için arama sorgusu oluştur
            const artistNames = item.track.artists.map((a: { name: string }) => a.name).join(' ');
            const searchQuery = `${item.track.name} ${artistNames}`;
            console.log(`Aranan şarkı (${i+1}/${tracks.length}): "${item.track.name}" - ${artistNames}`);
            
            // YouTube'da ara
            const videoId = await searchYouTubeVideo(youtubeToken, searchQuery);
            
            // Eğer video bulunduysa çalma listesine ekle
            if (videoId) {
              // API istek sayısını sınırlamak için kısa bir gecikme
              await new Promise(resolve => setTimeout(resolve, 500));
              
              const result = await addVideoToPlaylist(youtubeToken, youtubePlaylistId, videoId);
              if (result) {
                successfulTransfers++;
                console.log(`Şarkı eklendi (${successfulTransfers}/${tracks.length}): ${item.track.name}`);
              } else {
                failedTransfers.push(`${item.track.name} - ${artistNames}`);
                console.error(`Şarkı eklenemedi: ${item.track.name}`);
              }
            } else {
              failedTransfers.push(`${item.track.name} - ${artistNames}`);
              console.log(`Şarkı bulunamadı: ${item.track.name}`);
            }
          } catch (error) {
            failedTransfers.push(`${item.track.name} - ${item.track.artists.map((a: { name: string }) => a.name).join(' ')}`);
            console.error(`Şarkı aktarılırken hata: ${item.track.name}`, error);
          }
        }
        
        // Başarısız şarkıları loglayalım
        if (failedTransfers.length > 0) {
          console.log(`\n${failedTransfers.length} şarkı aktarılamadı:`);
          failedTransfers.forEach((song, index) => {
            console.log(`${index + 1}. ${song}`);
          });
        }
        
        console.log(`${playlist.name} listesi için aktarım tamamlandı. ${successfulTransfers}/${tracks.length} şarkı başarıyla aktarıldı.`);
      }
      
      // İşlem tamamlandı
      setLoading(false);
      setTransferProgress(null);
      alert('Çalma listeleri başarıyla YouTube\'a aktarıldı!');
      
      // Seçimleri temizle
      setSelectedPlaylists([]);
    } catch (err) {
      console.error('Aktarma sırasında hata oluştu:', err);
      setError('Çalma listelerini aktarırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
      setTransferProgress(null);
    }
  };

  if (loading && !transferProgress) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (transferProgress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Aktarılıyor: {transferProgress.playlistName}
        </h3>
        <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
            style={{ width: `${Math.round((transferProgress.current / transferProgress.total) * 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {transferProgress.current} / {transferProgress.total} şarkı
          ({Math.round((transferProgress.current / transferProgress.total) * 100)}%)
        </p>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Bu işlem biraz zaman alabilir. Lütfen sayfayı kapatmayın.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Hiç çalma listeniz yok veya bu uygulamaya erişim izni vermediniz.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Spotify Çalma Listeleriniz
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            className={`border rounded-lg overflow-hidden transition-all duration-200 ${
              selectedPlaylists.includes(playlist.id)
                ? 'border-blue-500 shadow-md bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="p-4 flex items-start space-x-3">
              <div className="relative h-16 w-16 flex-shrink-0">
                {playlist.images && playlist.images.length > 0 && playlist.images[0]?.url ? (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    fill
                    sizes="64px"
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">?</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">{playlist.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {playlist.tracks.total} şarkı • {playlist.owner.display_name}
                </p>
                
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => togglePlaylist(playlist.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      selectedPlaylists.includes(playlist.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {selectedPlaylists.includes(playlist.id) ? 'Seçildi ✓' : 'Seç'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedPlaylists.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => transferSelectedPlaylists()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {selectedPlaylists.length} Çalma Listesini YouTube&apos;a Aktar
          </button>
        </div>
      )}
    </div>
  );
} 