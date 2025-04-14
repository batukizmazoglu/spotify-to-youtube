// Spotify API yardımcı fonksiyonları
import axios from 'axios';

// Token geçerliliğini kontrol et
export const checkSpotifyToken = async (accessToken) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.error('Spotify token geçerlilik kontrolünde hata:', error);
    return false;
  }
};

// Spotify kullanıcıya otomatik olarak yönlendirme
export const redirectToSpotifyAuth = () => {
  if (typeof window !== 'undefined') {
    // Token'ları temizle
    localStorage.removeItem('spotify_token');
    
    const clientId = '8f0b9e6febfe4ca18bc90f84078d672a';
    const redirectUri = 'https://spotify-to-youtube-pink.vercel.app/login';
    const scope = 'playlist-read-private playlist-read-collaborative';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
    
    // Kullanıcıya bilgi ver
    alert('Spotify oturumunuzun süresi dolmuş. Yeniden giriş yapmanız gerekiyor.');
    
    // Kullanıcıyı Spotify yetkilendirme sayfasına yönlendir
    window.location.href = authUrl;
  }
};

// Spotify API'a istek yapmak için
export const fetchSpotifyPlaylists = async (accessToken) => {
  try {
    // Token geçerliliğini kontrol et
    const isValid = await checkSpotifyToken(accessToken);
    if (!isValid) {
      console.error('Spotify token geçersiz veya süresi dolmuş');
      redirectToSpotifyAuth();
      throw new Error('Spotify token geçersiz veya süresi dolmuş');
    }
    
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Spotify çalma listeleri alınırken hata oluştu:', error);
    
    // 401 hata kodu için yeniden yetkilendirme
    if (error.response && error.response.status === 401) {
      redirectToSpotifyAuth();
    }
    
    throw error;
  }
};

// Spotify access token alma
export const getSpotifyToken = async (code, clientId, clientSecret, redirectUri) => {
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
    console.error('Spotify erişim tokeni alınırken hata oluştu:', error);
    throw error;
  }
};

// Spotify çalma listesindeki parçaları al
export const fetchPlaylistTracks = async (accessToken, playlistId) => {
  try {
    // Token geçerliliğini kontrol et
    const isValid = await checkSpotifyToken(accessToken);
    if (!isValid) {
      console.error('Spotify token geçersiz veya süresi dolmuş');
      redirectToSpotifyAuth();
      throw new Error('Spotify token geçersiz veya süresi dolmuş');
    }
    
    // İlk sayfa şarkılarını al
    const firstResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 100, // Maksimum sayıda şarkı al
        offset: 0
      }
    });
    
    let tracks = firstResponse.data.items;
    console.log(`İlk sayfa şarkı sayısı: ${tracks.length}, Toplam: ${firstResponse.data.total}`);
    
    // Eğer 100'den fazla şarkı varsa, kalan şarkıları al
    if (firstResponse.data.total > tracks.length) {
      let offset = tracks.length;
      
      while (offset < firstResponse.data.total) {
        const additionalResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 100,
            offset: offset
          }
        });
        
        tracks = [...tracks, ...additionalResponse.data.items];
        offset += additionalResponse.data.items.length;
        console.log(`Ek sayfa şarkı sayısı: ${additionalResponse.data.items.length}, Toplam şimdiye kadar: ${tracks.length}`);
      }
    }
    
    console.log(`Çalma listesinde toplam ${tracks.length} şarkı bulundu`);
    return tracks;
  } catch (error) {
    console.error(`Çalma listesi parçaları alınırken hata oluştu (${playlistId}):`, error);
    
    // 401 hata kodu için yeniden yetkilendirme
    if (error.response && error.response.status === 401) {
      redirectToSpotifyAuth();
    }
    
    throw error;
  }
}; 