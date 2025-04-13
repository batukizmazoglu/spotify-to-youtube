# Spotify'dan YouTube'a Şarkı Listesi Aktarımı

Bu proje [Next.js](https://nextjs.org) kullanılarak geliştirilmiş, Spotify çalma listelerinizi YouTube çalma listelerine aktarmanızı sağlayan bir web uygulamasıdır.

## Başlangıç

İlk olarak, geliştirme sunucusunu başlatın:

```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
# veya
bun dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görebilirsiniz.

## Ortam Değişkenleri

Projenin çalışabilmesi için API anahtarlarının doğru şekilde ayarlanması gerekmektedir:

1. Projenin kök dizininde `.env.local` dosyası oluşturun
2. `.env.example` dosyasındaki değişkenleri `.env.local` dosyasına kopyalayın
3. Kendi API anahtarlarınızla değiştirin:
   - Spotify API anahtarları: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
   - Google API anahtarları: [Google Cloud Console](https://console.cloud.google.com/)

**Önemli Not:** `.env.local` dosyası hassas bilgiler içerdiği için asla GitHub'a yüklenMEMELİDİR. Bu dosya `.gitignore` içerisinde belirtilmiştir.

## Daha Fazla Bilgi

Next.js hakkında daha fazla bilgi edinmek için aşağıdaki kaynaklara bakabilirsiniz:

- [Next.js Dokümantasyonu](https://nextjs.org/docs) - Next.js özellikleri ve API'si hakkında bilgi edinin.
- [Next.js Öğrenin](https://nextjs.org/learn) - interaktif Next.js öğreticisi.

## Vercel Üzerinde Dağıtım

Next.js uygulamanızı dağıtmanın en kolay yolu, Next.js'in yaratıcıları tarafından sağlanan [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) kullanmaktır.

Daha fazla ayrıntı için [Next.js dağıtım dokümantasyonumuza](https://nextjs.org/docs/app/building-your-application/deploying) göz atabilirsiniz.
