'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  
  // Mevcut dil kodunu çıkarıp diğer dil kodunu ekleyerek yeni URL oluştur
  const otherLocale = currentLocale === 'tr' ? 'en' : 'tr';
  
  // URL'i parçalara ayır
  const segments = pathname.split('/').filter(Boolean);
  
  // İlk segment yerine diğer dil kodunu koy
  if (segments.length > 0 && (segments[0] === 'tr' || segments[0] === 'en')) {
    segments[0] = otherLocale;
  } else {
    // Eğer geçerli bir dil segmenti yoksa, diğer dili ekle
    segments.unshift(otherLocale);
  }
  
  // Yeni URL'i oluştur
  const otherLocaleUrl = `/${segments.join('/')}`;

  return (
    <div className="flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-200">
      <Link 
        href={otherLocaleUrl}
        className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center font-medium"
      >
        {currentLocale === 'tr' ? (
          <>
            <span className="mr-1.5">🇬🇧</span>
            <span>English</span>
          </>
        ) : (
          <>
            <span className="mr-1.5">🇹🇷</span>
            <span>Türkçe</span>
          </>
        )}
      </Link>
    </div>
  );
} 