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

  // Spotify connection status check
  useEffect(() => {
    // Check connection status from URL
    const spotifyConnected = searchParams.get('spotify') === 'connected';
    const spotifyError = searchParams.get('error');
    
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
  const redirectUri = 'https://oauth.pstmn.io/v1/callback';

  const handleSpotifyConnect = () => {
    // Tell users to get URL and enter it manually
    const clientId = spotifyClientId;
    const scope = 'playlist-read-private playlist-read-collaborative';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
    
    // Show instructions to the user in a popup
    alert('You will be redirected to Spotify authorization page. After authorization, you will need to copy the "code" parameter from the "Success!" page URL and return to our application.');
    
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
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Spotify'dan YouTube'a Aktarım
        </h1>
        
        <div className="space-y-6">
          <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg relative 
            ${isSpotifyConnected ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''}">
            
            {isSpotifyConnected && (
              <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1.5 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white mr-3 text-sm">1</span>
              Spotify Hesabınızı Bağlayın
            </h2>
            
            <button
              onClick={handleSpotifyConnect}
              disabled={isSpotifyConnected}
              className={`w-full py-3 px-4 rounded-md flex items-center justify-center font-medium transition-all ${
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
                  <li>"Success!" sayfasındaki URL'den "code" parametresini kopyalayın</li>
                  <li>Kopyaladığınız kodu aşağıdaki alana yapıştırın</li>
                </ol>
                <div className="mt-3 flex">
                  <input
                    type="text"
                    placeholder="Spotify kodunu buraya yapıştırın"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => {
                      // If it's a URL, extract the code parameter
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
                          // We can process it directly on the client side instead of sending to backend
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Onayla
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg relative
            ${isYoutubeConnected ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : ''}">
            
            {isYoutubeConnected && (
              <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white mr-3 text-sm">2</span>
              YouTube Hesabınızı Bağlayın
            </h2>
            
            {!isYoutubeConnected ? (
              isSpotifyConnected ? (
                <GoogleOAuthProvider clientId="507925114398-mebhu3dam2er8m5ltovrmp98btf0mp4v.apps.googleusercontent.com">
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleYoutubeSuccess}
                      onError={() => console.error('YouTube Login Error')}
                      useOneTap
                      context="use"
                      type="standard"
                      theme="filled_blue"
                      size="large"
                      logo_alignment="left"
                      width="280px"
                      text="signin_with"
                    />
                  </div>
                  <p className="text-xs text-center mt-3 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    Giriş sırasında "Tüm Google hizmetlerini görün" seçeneğini işaretleyin ve YouTube'u seçin.
                  </p>
                </GoogleOAuthProvider>
              ) : (
                <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    Önce Spotify'a bağlanmalısınız
                  </span>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center py-3 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Bağlantı Kuruldu
              </div>
            )}
          </div>
        </div>
        
        {(isSpotifyConnected && isYoutubeConnected) && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 p-0.5 rounded-md shadow-lg">
            <button
              onClick={() => router.push('/playlists')}
              className="w-full py-3 px-4 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-medium rounded-[3px] hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Çalma Listelerimi Göster
            </button>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 