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
      return NextResponse.json({ error: 'Code parameter is missing' }, { status: 400 });
    }

    // Get Spotify token
    const clientId = process.env.SPOTIFY_CLIENT_ID || '8f0b9e6febfe4ca18bc90f84078d672a';
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '5d04c84ca4544d15a64290d779a3b394';
    const redirectUri = 'https://spotify-to-youtube-pink.vercel.app/login';

    try {
      const tokenData = await getSpotifyToken(code, clientId, clientSecret, redirectUri);
      
      // Return only necessary information
      return NextResponse.json({
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
      });
    } catch (error) {
      console.error('Error retrieving token:', error);
      
      // More detailed error messages
      const apiError = error as SpotifyApiError;
      if (apiError.response) {
        return NextResponse.json({ 
          error: 'Spotify API error', 
          details: apiError.response.data 
        }, { status: apiError.response.status || 500 });
      }
      
      return NextResponse.json({ error: 'An error occurred while retrieving the token' }, { status: 500 });
    }
  } catch (error) {
    console.error('A general error occurred:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 