/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'mosaic.scdn.co', 
      'i.scdn.co', 
      'platform-lookaside.fbsbx.com',
      'image-cdn-ak.spotifycdn.com',
      'image-cdn-fa.spotifycdn.com',
      'image-cdn-tk.spotifycdn.com',
      'image-cdn.spotify.com',
      'i.spotifycdn.com'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 