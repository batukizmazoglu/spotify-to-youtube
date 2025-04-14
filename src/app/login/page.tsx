'use client';

import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';

// Loading component
function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8 max-w-lg md:max-w-xl lg:max-w-3xl w-full">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Login Page Component
export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginContent />
    </Suspense>
  );
}

// Client component that uses useSearchParams hook
import { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const { isSpotifyConnected, isYoutubeConnected, setYoutubeToken, setSpotifyToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Spotify connection status check
  useEffect(() => {
    // Check connection status from URL
    const spotifyConnected = searchParams.get('spotify') === 'connected';
    const spotifyError = searchParams.get('error');
    
    // Spotify kodu URL'den otomatik olarak al (yeni eklendi)
    const spotifyCode = searchParams.get('code');
    if (spotifyCode) {
      handleSpotifyCode(spotifyCode);
    }
    
    // If access token exists, use it to connect to Spotify
    const spotifyToken = searchParams.get('access_token');
    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
      router.replace('/login?spotify=connected'); // Clear token from URL
    }
    
    // Check if YouTube/Google access token exists in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const youtubeToken = hashParams.get('access_token');
    
    if (youtubeToken) {
      console.log('YouTube token retrieved from URL!');
      setYoutubeToken(youtubeToken);
      
      // Clear URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (spotifyConnected) {
      // You can show success message (optional)
      console.log('Spotify connection successful!');
    }
    
    if (spotifyError) {
      // You can show error message
      console.error('Spotify connection error:', spotifyError);
    }
  }, [searchParams, setSpotifyToken, setYoutubeToken, router]);

  // Get Spotify Client ID from .env file, or use provided ID
  const spotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '8f0b9e6febfe4ca18bc90f84078d672a';
  
  // Use redirect URI that Spotify has specifically allowed
  const redirectUri = 'https://spotify-to-youtube-pink.vercel.app/login';

  // Spotify kodu işleme fonksiyonu (yeni eklendi)
  const handleSpotifyCode = async (code: string) => {
    try {
      const response = await fetch('/api/manual-token?code=' + encodeURIComponent(code));
      const data = await response.json();
      if (data.access_token) {
        setSpotifyToken(data.access_token);
        router.replace('/login?spotify=connected');
      } else {
        console.error('Geçersiz kod veya bir hata oluştu:', data.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      console.error('Kod değişimi sırasında bir hata oluştu:', error);
    }
  };

  const handleSpotifyConnect = () => {
    // Tell users to get URL and enter it manually
    const clientId = spotifyClientId;
    const scope = 'playlist-read-private playlist-read-collaborative';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
    
    // Kullanıcıya bilgilendirme mesajı göster (güncellendi)
    alert('Spotify yetkilendirme sayfasına yönlendirileceksiniz. Yetkilendirme sonrası otomatik olarak uygulamaya geri döneceksiniz.');
    
    window.location.href = authUrl;
  };

  // YouTube connection function
  const handleYoutubeSuccess = (credentialResponse: CredentialResponse) => {
    // Save token from Google
    if (credentialResponse.credential) {
      // This token is just for authentication, not for YouTube API access
      console.log('Google authentication successful! Token received.');
      
      // Now redirect user to YouTube API authorization
      const scope = 'https://www.googleapis.com/auth/youtube';
      const clientId = '507925114398-mebhu3dam2er8m5ltovrmp98btf0mp4v.apps.googleusercontent.com';
      const redirectUri = encodeURIComponent(window.location.origin + '/login');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&include_granted_scopes=true&prompt=consent`;
      
      setYoutubeToken(credentialResponse.credential);
      
      // Redirect user to YouTube API authorization page
      window.location.href = authUrl;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8 max-w-lg md:max-w-xl lg:max-w-3xl w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Spotify&apos;dan YouTube&apos;a Aktarım
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 sm:p-5 border border-gray-200 dark:border-gray-700 rounded-lg relative 
            ${isSpotifyConnected ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''}`}>
            
            {isSpotifyConnected && (
              <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1.5 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-600 text-white mr-2 sm:mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </span>
              Spotify Hesabınızı Bağlayın
            </h2>
            
            <button
              onClick={handleSpotifyConnect}
              disabled={isSpotifyConnected}
              className={`w-full py-3 px-4 rounded-md flex items-center justify-center font-medium text-base transition-all ${
                isSpotifyConnected
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
              }`}
            >
              {isSpotifyConnected ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Bağlantı Kuruldu
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify ile Bağlan
                </span>
              )}
            </button>
            
            {!isSpotifyConnected && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md border border-blue-100 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Bağlantı Talimatları:</h3>
                <ol className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-decimal pl-4">
                  <li>Spotify yetkilendirme sayfasına yönlendirileceksiniz</li>
                  <li>Spotify hesabınıza giriş yapın ve izin verin</li>
                  <li>Yetkilendirme sonrası otomatik olarak bu sayfaya geri döneceksiniz</li>
                </ol>
              </div>
            )}
          </div>
          
          <div className={`p-4 sm:p-5 border border-gray-200 dark:border-gray-700 rounded-lg relative
            ${isYoutubeConnected ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : ''}`}>
            
            {isYoutubeConnected && (
              <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-600 text-white mr-2 sm:mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </span>
              YouTube Hesabınızı Bağlayın
            </h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                YouTube hesabınıza bağlanmak için aşağıdaki butonu kullanın. YouTube Music&apos;e çalma listesi aktarabilmek için hesabınıza erişim izni gereklidir.
              </p>
              
              {!isYoutubeConnected ? (
                <GoogleOAuthProvider clientId="507925114398-mebhu3dam2er8m5ltovrmp98btf0mp4v.apps.googleusercontent.com">
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleYoutubeSuccess}
                      onError={() => {
                        console.log('YouTube login failed');
                        alert('YouTube bağlantısı başarısız oldu. Lütfen tekrar deneyin.');
                      }}
                      theme="filled_blue"
                      shape="rectangular"
                      size="large"
                    />
                  </div>
                </GoogleOAuthProvider>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 bg-red-100 text-red-800 rounded-md flex items-center justify-center font-medium cursor-not-allowed"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Bağlantı Kuruldu
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {isSpotifyConnected && isYoutubeConnected && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800 text-center">
            <p className="text-green-700 dark:text-green-300 mb-4">
              Tebrikler! Artık çalma listelerinizi aktarmaya hazırsınız.
            </p>
            <Link 
              href="/playlists"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg w-full"
            >
              <span>Çalma Listelerinizi Görüntüleyin</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 