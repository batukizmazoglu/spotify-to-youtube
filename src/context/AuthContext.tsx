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

  // Load tokens from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSpotifyToken = localStorage.getItem('spotify_token');
      const savedYoutubeToken = localStorage.getItem('youtube_token');
      
      if (savedSpotifyToken) setSpotifyToken(savedSpotifyToken);
      if (savedYoutubeToken) setYoutubeToken(savedYoutubeToken);
    }
  }, []);

  // Save to localStorage when token changes
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
          // Save the token directly without decoding
          console.log('YouTube token received, saving...');
          
          // Save token
          localStorage.setItem('youtube_token', youtubeToken);
          
          // Authorization header for Google API
          // Token from URL hash can be used directly in API
          if (youtubeToken.startsWith('ya29.') || youtubeToken.length > 100) {
            // This is a Google API access token 
            localStorage.setItem('google_auth_header', `Bearer ${youtubeToken}`);
          } else {
            // This is an ID token, not suitable for API access
            console.warn('Google ID token saved, but may not be sufficient for API access.');
          }
        } catch (error) {
          console.error('Error processing YouTube token:', error);
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