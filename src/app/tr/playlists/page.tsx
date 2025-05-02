'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PlaylistList from '@/components/PlaylistList';
import Link from 'next/link';

export default function PlaylistsPage() {
  const { isSpotifyConnected, isYoutubeConnected } = useAuth();
  const router = useRouter();

  // Check connection status
  useEffect(() => {
    // If not connected, redirect to login page
    if (!isSpotifyConnected || !isYoutubeConnected) {
      router.push('/tr/login');
    }
  }, [isSpotifyConnected, isYoutubeConnected, router]);

  return (
    <div className="flex min-h-screen flex-col p-4 sm:p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 container mx-auto max-w-5xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Çalma Listeleri Aktarımı
        </h1>
        <Link
          href="/tr"
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ana Sayfa
        </Link>
      </header>

      <main className="flex-1 container mx-auto max-w-5xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="mb-6 flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center bg-white dark:bg-gray-700 px-3 sm:px-4 py-2 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
              <div className={`w-3 h-3 rounded-full mr-2 ${isSpotifyConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                Spotify: {isSpotifyConnected ? 'Bağlandı' : 'Bağlantı yok'}
              </span>
            </div>
            
            <div className="flex items-center bg-white dark:bg-gray-700 px-3 sm:px-4 py-2 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
              <div className={`w-3 h-3 rounded-full mr-2 ${isYoutubeConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                YouTube: {isYoutubeConnected ? 'Bağlandı' : 'Bağlantı yok'}
              </span>
            </div>
          </div>

          {isSpotifyConnected && isYoutubeConnected ? (
            <PlaylistList />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 sm:px-6 py-4 sm:py-5 rounded-lg flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 sm:h-10 w-8 sm:w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2 text-center sm:text-left">Bağlantı Gerekli</h3>
                <p className="mb-3 text-sm sm:text-base text-center sm:text-left">Çalma listelerinizi görüntüleyebilmek ve aktarabilmek için hem Spotify hem de YouTube hesaplarınızı bağlamanız gerekmektedir.</p>
                <div className="flex justify-center sm:justify-start">
                  <Link
                    href="/tr/login"
                    className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>Giriş Sayfasına Dön</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 