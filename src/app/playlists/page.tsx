'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PlaylistList from '@/components/PlaylistList';
import Link from 'next/link';

export default function PlaylistsPage() {
  const { isSpotifyConnected, isYoutubeConnected } = useAuth();
  const router = useRouter();

  // Bağlantı durumunu kontrol et
  useEffect(() => {
    // Eğer bağlantı yoksa login sayfasına yönlendir
    if (!isSpotifyConnected || !isYoutubeConnected) {
      router.push('/login');
    }
  }, [isSpotifyConnected, isYoutubeConnected, router]);

  return (
    <div className="flex min-h-screen flex-col p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Çalma Listelerini Aktar
        </h1>
        <Link
          href="/"
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          Ana Sayfa
        </Link>
      </header>

      <main className="flex-1 container mx-auto max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${isSpotifyConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Spotify: {isSpotifyConnected ? 'Bağlandı' : 'Bağlantı yok'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${isYoutubeConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              YouTube: {isYoutubeConnected ? 'Bağlandı' : 'Bağlantı yok'}
            </span>
          </div>
        </div>

        {isSpotifyConnected && isYoutubeConnected ? (
          <PlaylistList />
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Hem Spotify hem de YouTube hesaplarınıza bağlanmanız gerekiyor.</p>
            <Link
              href="/login"
              className="mt-2 inline-block font-medium text-blue-500 hover:text-blue-700"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 