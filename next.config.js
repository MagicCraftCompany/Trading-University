/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['ui-avatars.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure publicRuntimeConfig is available
  publicRuntimeConfig: {
    staticFolder: '/assets',
  },
  // Add environment variables accessible from the client
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 
                         (process.env.NODE_ENV === 'production' 
                          ? process.env.NEXT_PUBLIC_BASE_URL 
                          : 'http://localhost:3000'),
  },
  // Use NEXT_PUBLIC_BASE_URL for production asset prefix
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL || '' : '',
}

module.exports = nextConfig
