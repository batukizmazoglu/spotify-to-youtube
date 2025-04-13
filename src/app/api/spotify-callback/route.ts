import { NextResponse } from 'next/server';
import { getSpotifyToken } from '@/utils/spotify';

export async function GET(request: Request) {
  try {
    // URL'den parametreleri al
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    // Hata kontrolü
    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${error}`, url.origin));
    }

    // Code kontrolü
    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', url.origin));
    }

    // Spotify token al
    const clientId = process.env.SPOTIFY_CLIENT_ID || '8f0b9e6febfe4ca18bc90f84078d672a';
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '5d04c84ca4544d15a64290d779a3b394';
    const redirectUri = `${url.origin}/api/spotify-callback`;

    // Spotify token'ı al
    const tokenData = await getSpotifyToken(code, clientId, clientSecret, redirectUri);
    
    // Token alındıktan sonra token=true parametresi ekleyerek yönlendir
    // tokenData kullanılarak cookie yerine URL'e token hash eklenebilir
    const tokenHash = tokenData.access_token.substring(0, 8); // ilk 8 karakteri güvenlik için al
    
    // Başarı URL'si ile yönlendir
    return NextResponse.redirect(
      new URL(`/login?spotify=connected&token_received=true&hash=${tokenHash}`, url.origin)
    );
  } catch (error) {
    console.error('Spotify callback işlenirken hata oluştu:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', new URL(request.url).origin));
  }
} 