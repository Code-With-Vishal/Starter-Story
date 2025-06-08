/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure the app works without a server
  experimental: {
    appDir: false,
  },
  // Configure webpack to handle extension-specific requirements
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Change the output directory structure to be Chrome extension friendly
  distDir: 'build',
  assetPrefix: 'assets',
}