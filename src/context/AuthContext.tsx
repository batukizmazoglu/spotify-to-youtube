'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type AuthContextType = {
  spotifyToken: string | null;
  youtubeToken: string | null;
  isSpotifyConnected: boolean;
  isYoutubeConnected: boolean;
  setSpotifyToken: (token: string | null) => void;
  setYoutubeToken: (token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [youtubeToken, setYoutubeToken] = useState<string | null>(null);

  // LocalStorage'dan token'ları yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSpotifyToken = localStorage.getItem('spotify_token');
      const savedYoutubeToken = localStorage.getItem('youtube_token');
      
      if (savedSpotifyToken) setSpotifyToken(savedSpotifyToken);
      if (savedYoutubeToken) setYoutubeToken(savedYoutubeToken);
    }
  }, []);

  // Token değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (spotifyToken) {
        localStorage.setItem('spotify_token', spotifyToken);
      } else {
        localStorage.removeItem('spotify_token');
      }
    }
  }, [spotifyToken]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (youtubeToken) {
        try {
          // Token'ı decode etmeden direkt kaydediyoruz
          console.log('YouTube token alındı, kaydediliyor...');
          
          // Token'ı kaydet
          localStorage.setItem('youtube_token', youtubeToken);
          
          // Google API için authorization header
          // URL hash'ten alınan token, direkt API'de kullanılabilir
          if (youtubeToken.startsWith('ya29.') || youtubeToken.length > 100) {
            // Bu bir Google API access token 
            localStorage.setItem('google_auth_header', `Bearer ${youtubeToken}`);
          } else {
            // Bu bir ID token, API erişimi için uygun değil
            console.warn('Google ID token kaydedildi, ancak API erişimi için yeterli olmayabilir.');
          }
        } catch (error) {
          console.error('YouTube token işlenirken hata:', error);
          localStorage.removeItem('youtube_token');
          localStorage.removeItem('google_auth_header');
        }
      } else {
        localStorage.removeItem('youtube_token');
        localStorage.removeItem('google_auth_header');
      }
    }
  }, [youtubeToken]);

  const logout = () => {
    setSpotifyToken(null);
    setYoutubeToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('youtube_token');
      localStorage.removeItem('google_auth_header');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        spotifyToken,
        youtubeToken,
        isSpotifyConnected: !!spotifyToken,
        isYoutubeConnected: !!youtubeToken,
        setSpotifyToken,
        setYoutubeToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 