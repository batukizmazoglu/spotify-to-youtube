import { NextResponse } from 'next/server';
import { getSpotifyToken } from '@/utils/spotify';

export async function GET(request: Request) {
  try {
    // Get parameters from URL
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    // Error check
    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${error}`, url.origin));
    }

    // Code check
    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', url.origin));
    }

    // Get Spotify token
    const clientId = process.env.SPOTIFY_CLIENT_ID || '8f0b9e6febfe4ca18bc90f84078d672a';
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '5d04c84ca4544d15a64290d779a3b394';
    const redirectUri = `https://spotify-to-youtube-pink.vercel.app`;

    // Get Spotify token
    const tokenData = await getSpotifyToken(code, clientId, clientSecret, redirectUri);
    
    // After getting the token, redirect with token=true parameter
    // URL token hash can be added instead of cookie using tokenData
    const tokenHash = tokenData.access_token.substring(0, 8); // take first 8 characters for security
    
    // Redirect with success URL
    return NextResponse.redirect(
      new URL(`/login?spotify=connected&token_received=true&hash=${tokenHash}`, url.origin)
    );
  } catch (error) {
    console.error('Error processing Spotify callback:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', new URL(request.url).origin));
  }
} 