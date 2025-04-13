// YouTube API yardımcı fonksiyonları
import axios from 'axios';

// YouTube'da video arama
export const searchYouTubeVideo = async (accessToken, query) => {
  try {
    // localStorage'dan auth header'ı kontrol et
    const authHeader = typeof window !== 'undefined' 
      ? localStorage.getItem('google_auth_header') || `Bearer ${accessToken}`
      : `Bearer ${accessToken}`;
      
    console.log(`Orijinal arama sorgusu: "${query}"`);
    
    // İlk deneme: Tam sorgu ile ara
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 1,
        videoEmbeddable: true,
      },
      headers: {
        Authorization: authHeader,
      },
    });
    
    // Video bulunduysa ID'yi döndür
    if (response.data.items && response.data.items.length > 0 && response.data.items[0].id?.videoId) {
      console.log(`Video bulundu: ${response.data.items[0].id.videoId}`);
      return response.data.items[0].id.videoId;
    }
    
    // İlk aramada sonuç yoksa, daha basit bir sorgu ile tekrar ara
    // Parantezleri, özel karakterleri ve gereksiz kelimeleri çıkar
    const simplifiedQuery = query
      .replace(/[()[\]{}]/g, '') // Parantezleri kaldır
      .replace(/feat\.|ft\.|featuring/gi, '') // "feat", "ft" gibi ifadeleri kaldır
      .replace(/official\s*(video|audio|music\s*video)/gi, '') // "official video" gibi ifadeleri kaldır
      .replace(/\s{2,}/g, ' ') // Fazla boşlukları kaldır
      .trim();
    
    console.log(`Basitleştirilmiş arama sorgusu: "${simplifiedQuery}"`);
    
    const secondResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: simplifiedQuery,
        type: 'video',
        maxResults: 1,
        videoEmbeddable: true,
      },
      headers: {
        Authorization: authHeader,
      },
    });
    
    // İkinci denemede video bulunduysa ID'yi döndür
    if (secondResponse.data.items && secondResponse.data.items.length > 0 && secondResponse.data.items[0].id?.videoId) {
      console.log(`İkinci denemede video bulundu: ${secondResponse.data.items[0].id.videoId}`);
      return secondResponse.data.items[0].id.videoId;
    }
    
    // En son çare olarak, şarkı adı ve sanatçıyı ayırıp sadece onlarla ara
    const parts = simplifiedQuery.split(' ');
    const shortQuery = parts.slice(0, Math.min(6, parts.length)).join(' '); // En fazla ilk 6 kelimeyi al
    
    console.log(`Son deneme arama sorgusu: "${shortQuery}"`);
    
    const lastResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: shortQuery,
        type: 'video',
        maxResults: 1,
        videoEmbeddable: true,
      },
      headers: {
        Authorization: authHeader,
      },
    });
    
    // Son denemede video bulunduysa ID'yi döndür
    if (lastResponse.data.items && lastResponse.data.items.length > 0 && lastResponse.data.items[0].id?.videoId) {
      console.log(`Son denemede video bulundu: ${lastResponse.data.items[0].id.videoId}`);
      return lastResponse.data.items[0].id.videoId;
    }
    
    console.log(`Hiçbir arama sonuç vermedi: "${query}"`);
    return null;
  } catch (error) {
    console.error('YouTube video araması yapılırken hata oluştu:', error);
    throw error;
  }
};

// YouTube çalma listesi oluşturma
export const createYouTubePlaylist = async (accessToken, title, description) => {
  // Önce token kontrolü yap, token direkt yok ise kullanıcıyı yetkilendirmeye yönlendir
  if (!accessToken) {
    console.error('YouTube token yok! Yetkilendirme gerekiyor.');
    redirectToYouTubeAuth();
    throw new Error('YouTube yetkilendirmesi gerekiyor');
  }
  
  try {
    // localStorage'dan auth header'ı kontrol et
    const authHeader = typeof window !== 'undefined' 
      ? localStorage.getItem('google_auth_header') || `Bearer ${accessToken}`
      : `Bearer ${accessToken}`;
      
    console.log('YouTube çalma listesi oluşturma isteği gönderiliyor...');
    console.log('Auth Header tipi:', typeof authHeader);
    console.log('Auth Header başlangıcı:', authHeader?.substring(0, 15));
    
    // Google/YouTube API'nin ihtiyaç duyduğu ek parametreler
    const config = {
      method: 'post',
      url: 'https://www.googleapis.com/youtube/v3/playlists',
      data: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'private',
        },
      },
      params: {
        part: 'snippet,status',
      },
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
    
    console.log('İstek ayarları:', JSON.stringify(config, null, 2));
    
    // Alternatif axios yapılandırması
    const response = await axios(config);
    
    console.log('YouTube yanıtı:', response.status);
    return response.data.id;
  } catch (error) {
    console.error('YouTube çalma listesi oluşturulurken hata oluştu:', error);
    if (error.response) {
      console.error('Hata detayları:', error.response.data);
      console.error('Hata durumu:', error.response.status);
      
      // Yetkilendirme hatası kontrolü
      if (error.response.status === 401) {
        console.error('Yetkilendirme hatası! Token geçersiz veya süresi dolmuş olabilir.');
        // Kullanıcıyı yeniden giriş için yönlendir
        redirectToYouTubeAuth();
      }
      
      // Diğer yaygın hataları işle
      if (error.response.status === 403) {
        console.error('İzin hatası! API kullanım kotası aşılmış veya bu işlem için izniniz yok.');
        alert('YouTube API kullanımı için yeterli izniniz yok. Lütfen tekrar giriş yaparak YouTube izinlerini onaylayın.');
        redirectToYouTubeAuth();
      }
    }
    throw error;
  }
};

// YouTube çalma listesine video ekleme
export const addVideoToPlaylist = async (accessToken, playlistId, videoId) => {
  try {
    // localStorage'dan auth header'ı kontrol et
    const authHeader = typeof window !== 'undefined' 
      ? localStorage.getItem('google_auth_header') || `Bearer ${accessToken}`
      : `Bearer ${accessToken}`;
    
    // API istek sayısını sınırlamak için kısa bir gecikme ekleyelim
    await new Promise(resolve => setTimeout(resolve, 300)); // 300ms bekle
    
    console.log(`YouTube çalma listesine video ekleniyor: ${videoId} -> ${playlistId}`);
      
    const response = await axios.post(
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
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Ekleme başarılı ise yanıt kodunu kontrol edelim
    if (response.status === 200) {
      console.log(`Video başarıyla eklendi: ${videoId}, ID: ${response.data.id}`);
      return true;
    } else {
      console.warn(`Video eklenirken beklenmeyen yanıt kodu: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('YouTube çalma listesine video eklenirken hata oluştu:', error);
    
    // Hata detaylarını loglayalım
    if (error.response) {
      console.error('Hata detayları:', error.response.data);
      
      // Quota aşımı veya rate limit hataları için
      if (error.response.status === 403 || error.response.status === 429) {
        console.error('Yetki hatası veya istek limiti aşıldı. Biraz bekledikten sonra tekrar deneniyor...');
        
        // Biraz bekle ve tekrar dene
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle
        
        try {
          const retryResponse = await axios.post(
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
                Authorization: authHeader,
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (retryResponse.status === 200) {
            console.log(`Yeniden deneme başarılı! Video eklendi: ${videoId}`);
            return true;
          }
        } catch (retryError) {
          console.error('Yeniden deneme başarısız:', retryError);
        }
      }
      
      // Video zaten listeye eklenmiş olabilir
      if (error.response.data?.error?.errors?.some(e => e.reason === 'playlistItemsNotAccessible')) {
        console.log(`Video zaten listeye eklenmiş olabilir: ${videoId}`);
        return true; // Başarılı sayalım
      }
    }
    
    return false;
  }
};

// YouTube yetkilendirme sayfasına yönlendirme helper fonksiyonu
function redirectToYouTubeAuth() {
  if (typeof window !== 'undefined') {
    // Token'ları temizle
    localStorage.removeItem('youtube_token');
    localStorage.removeItem('google_auth_header');
    
    // YouTube API scope tanımla
    const scope = 'https://www.googleapis.com/auth/youtube';
    const clientId = '507925114398-mebhu3dam2er8m5ltovrmp98btf0mp4v.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent(window.location.origin + '/login');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&include_granted_scopes=true&prompt=consent`;
    
    // Kullanıcıya bilgi ver
    alert('YouTube yetkilendirmesi gerekiyor. Yetkilendirme sayfasına yönlendiriliyorsunuz.');
    
    // Kullanıcıyı YouTube yetkilendirme sayfasına yönlendir
    window.location.href = authUrl;
  }
} 