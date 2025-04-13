'use client';

import { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { isSpotifyConnected, isYoutubeConnected, setYoutubeToken, setSpotifyToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Spotify bağlantı durum kontrolü
  useEffect(() => {
    // URL'den bağlantı durumunu kontrol et
    const spotifyConnected = searchParams.get('spotify') === 'connected';
    const spotifyError = searchParams.get('error');
    
    // Eğer access token varsa, onu kullanarak Spotify'a bağlan
    const spotifyToken = searchParams.get('access_token');
    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
      router.replace('/login?spotify=connected'); // URL'den tokeni temizle
    }
    
    // URL'de YouTube/Google access token var mı kontrol et
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const youtubeToken = hashParams.get('access_token');
    
    if (youtubeToken) {
      console.log('YouTube token URL\'den alındı!');
      setYoutubeToken(youtubeToken);
      
      // URL'yi temizle
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (spotifyConnected) {
      // Başarı mesajı gösterebilirsiniz (opsiyonel)
      console.log('Spotify bağlantısı başarılı!');
    }
    
    if (spotifyError) {
      // Hata mesajı gösterebilirsiniz
      console.error('Spotify bağlantı hatası:', spotifyError);
    }
  }, [searchParams, setSpotifyToken, setYoutubeToken, router]);

  // .env dosyasından Spotify Client ID'yi al, yoksa verilen ID'yi kullan
  const spotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '8f0b9e6febfe4ca18bc90f84078d672a';
  
  // Spotify'ın özel olarak izin verdiği bir redirect URI kullan
  const redirectUri = 'https://oauth.pstmn.io/v1/callback';

  const handleSpotifyConnect = () => {
    // Kullanıcıya URL'yi almalarını ve manuel olarak girmelerini söyle
    const clientId = spotifyClientId;
    const scope = 'playlist-read-private playlist-read-collaborative';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
    
    // Bir popup açarak kullanıcıya talimatları göster
    alert('Spotify yetkilendirme sayfasına yönlendirileceksiniz. Yetkilendirme yaptıktan sonra, görüntülenecek "Success!" sayfasındaki URL\'den "code" parametresini alıp uygulamamıza dönmeniz gerekecek.');
    
    window.location.href = authUrl;
  };

  // YouTube bağlanma işlevi
  const handleYoutubeSuccess = (credentialResponse: CredentialResponse) => {
    // Google'dan gelen token'ı kaydet
    if (credentialResponse.credential) {
      // Bu token sadece kimlik doğrulama için, YouTube API erişimi için değil
      console.log('Google kimlik doğrulama başarılı! Token alındı.');
      
      // Bu aşamada kullanıcıyı YouTube API için yetkilendirmeye yönlendir
      const scope = 'https://www.googleapis.com/auth/youtube';
      const clientId = '507925114398-mebhu3dam2er8m5ltovrmp98btf0mp4v.apps.googleusercontent.com';
      const redirectUri = encodeURIComponent(window.location.origin + '/login');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&include_granted_scopes=true&prompt=consent`;
      
      setYoutubeToken(credentialResponse.credential);
      
      // Kullanıcıyı YouTube API yetkilendirme sayfasına yönlendir
      window.location.href = authUrl;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Spotify&apos;dan YouTube&apos;a Çalma Listesi Aktarma
        </h1>
        
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <span className="mr-2">1.</span> Spotify Hesabınıza Bağlanın
            </h2>
            
            <button
              onClick={handleSpotifyConnect}
              disabled={isSpotifyConnected}
              className={`w-full py-2 px-4 rounded-md flex items-center justify-center font-medium ${
                isSpotifyConnected
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isSpotifyConnected ? 'Bağlandı ✓' : 'Spotify ile Bağlan'}
            </button>
            
            {!isSpotifyConnected && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <p>
                  Not: Spotify yetkilendirme yaptıktan sonra, görüntülenen &quot;Success!&quot; sayfasının URL&apos;sinden
                  aldığınız kodu aşağıya yapıştırın:
                </p>
                <div className="mt-2 flex">
                  <input
                    type="text"
                    placeholder="Spotify code parametresini buraya yapıştırın"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                    onChange={(e) => {
                      // Eğer URL ise, code parametresini çıkar
                      const value = e.target.value;
                      const codeMatch = value.match(/code=([^&]+)/);
                      const code = codeMatch ? codeMatch[1] : value;
                      e.target.value = code;
                    }}
                  />
                  <button
                    onClick={async (e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      const code = input.value.trim();
                      if (code) {
                        try {
                          // Backend'e istek göndermek yerine direkt client tarafında işleyebiliriz
                          const response = await fetch('/api/manual-token?code=' + encodeURIComponent(code));
                          const data = await response.json();
                          if (data.access_token) {
                            setSpotifyToken(data.access_token);
                            router.replace('/login?spotify=connected');
                          }
                        } catch {
                          alert('Token alınırken hata oluştu. Lütfen tekrar deneyin.');
                        }
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md text-sm hover:bg-blue-700"
                  >
                    Onayla
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <span className="mr-2">2.</span> YouTube Hesabınıza Bağlanın
            </h2>
            
            {!isYoutubeConnected ? (
              isSpotifyConnected ? (
                <GoogleOAuthProvider clientId="507925114398-mebhu3dam2er8m5ltovrmp98btf0mp4v.apps.googleusercontent.com">
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleYoutubeSuccess}
                      onError={() => console.error('YouTube Giriş Hatası')}
                      useOneTap
                      context="use"
                      type="standard"
                      theme="filled_blue"
                      size="large"
                      logo_alignment="left"
                      width="280px"
                      locale="tr_TR"
                      text="signin_with"
                    />
                  </div>
                  <p className="text-xs text-center mt-2 text-gray-500">
                    Giriş yaparken &quot;Tüm Google hizmetlerini gör&quot; seçeneğini işaretlediğinizden emin olun ve YouTube&apos;u seçin.
                  </p>
                </GoogleOAuthProvider>
              ) : (
                <div className="text-center py-3 bg-gray-200 text-gray-600 rounded-md">
                  Önce Spotify&apos;a bağlanın
                </div>
              )
            ) : (
              <div className="text-center py-2 bg-red-100 text-red-800 rounded-md">
                Bağlandı ✓
              </div>
            )}
          </div>
        </div>
        
        {(isSpotifyConnected && isYoutubeConnected) && (
          <div className="mt-6">
            <button
              onClick={() => router.push('/playlists')}
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Çalma Listelerimi Göster
            </button>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
} 