import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          Spotify&apos;dan YouTube&apos;a Çalma Listesi Aktarma
        </h1>
        
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
          Spotify çalma listelerinizi kolayca YouTube Music&apos;e aktarın ve her iki platformda da müziğinize erişin.
        </p>
        
        <Link 
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Başlamak için Giriş Yapın
        </Link>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Hesaplarınızı Bağlayın</h2>
            <p className="text-gray-600 dark:text-gray-400">Spotify ve YouTube hesaplarınıza güvenli bir şekilde bağlanın.</p>
          </div>

          <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Çalma Listelerinizi Seçin</h2>
            <p className="text-gray-600 dark:text-gray-400">Aktarmak istediğiniz Spotify çalma listelerini seçin.</p>
          </div>
          
          <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Transfer Tamamlandı</h2>
            <p className="text-gray-600 dark:text-gray-400">Seçilen çalma listeleri YouTube Music&apos;e aktarılır.</p>
          </div>
        </div>
        
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Bu uygulama, Spotify Web API ve YouTube Data API kullanılarak hazırlanmıştır.</p>
        </div>
        </div>
      </main>
  );
}
