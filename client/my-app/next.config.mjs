/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: [
      'giasunhantaiviet.com',
      'giasuhanoigioi.edu.vn',
      'unix.edu.vn',
      'i.pinimg.com',
      'firebasestorage.googleapis.com',
      // Add other image domains as needed
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Environment variables validation (optional)
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
