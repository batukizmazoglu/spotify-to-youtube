import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="relative h-36 sm:h-40 md:h-60 w-full bg-gradient-to-r from-green-500 to-blue-600">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center px-4 drop-shadow-md">
              Spotify&apos;dan YouTube&apos;a Aktarım
            </h1>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 md:p-8 text-center">
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-600 dark:text-gray-300">
            Spotify çalma listelerinizi kolayca YouTube Music&apos;e aktarın ve müziğinize her iki platformda da erişin.
          </p>
          
          <Link 
            href="/login"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 sm:px-8 rounded-lg text-base transition-all duration-200 hover:shadow-lg group"
          >
            <span>Başlamak İçin Giriş Yapın</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <div className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">Hesaplarınızı Bağlayın</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Spotify ve YouTube hesaplarınıza güvenli bir şekilde bağlanın.</p>
            </div>

            <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <div className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">Çalma Listelerinizi Seçin</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Aktarmak istediğiniz Spotify çalma listelerini seçin.</p>
            </div>
            
            <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <div className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">Aktarım Tamamlandı</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Seçilen çalma listeleri YouTube Music&apos;e aktarılır.</p>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 rounded-lg">
            <div className="flex space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="#1DB954" />
                </svg>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-center sm:text-left text-gray-500 dark:text-gray-400">
              Bu uygulama, Spotify Web API ve YouTube Data API kullanılarak oluşturulmuştur.
            </p>
          </div>
          
        </div>
      </div>
    </main>
  );
}
