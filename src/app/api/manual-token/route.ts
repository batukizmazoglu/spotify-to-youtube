import { NextResponse } from 'next/server';
import { getSpotifyToken } from '@/utils/spotify';

interface SpotifyApiError {
  response?: {
    data: Record<string, unknown>;
    status: number;
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Kod parametresi eksik' }, { status: 400 });
    }

    // Spotify token al
    const clientId = process.env.SPOTIFY_CLIENT_ID || '8f0b9e6febfe4ca18bc90f84078d672a';
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '5d04c84ca4544d15a64290d779a3b394';
    const redirectUri = 'https://oauth.pstmn.io/v1/callback';

    try {
      const tokenData = await getSpotifyToken(code, clientId, clientSecret, redirectUri);
      
      // Sadece gerekli bilgileri döndür
      return NextResponse.json({
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
      });
    } catch (error) {
      console.error('Token alınırken hata oluştu:', error);
      
      // Daha detaylı hata mesajları
      const apiError = error as SpotifyApiError;
      if (apiError.response) {
        return NextResponse.json({ 
          error: 'Spotify API hatası', 
          details: apiError.response.data 
        }, { status: apiError.response.status || 500 });
      }
      
      return NextResponse.json({ error: 'Token alınırken bir hata oluştu' }, { status: 500 });
    }
  } catch (error) {
    console.error('Genel bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 