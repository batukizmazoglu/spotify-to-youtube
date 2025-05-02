'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  
  // Mevcut rotadan locale'i çıkar ve yeni locale ile yeni rota oluştur
  const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
  const otherLocale = currentLocale === 'tr' ? 'en' : 'tr';
  const otherLocaleUrl = `/${otherLocale}${pathnameWithoutLocale}`;

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