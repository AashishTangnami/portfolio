/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    // Define image domains for remote images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Enable image optimization
    unoptimized: false,
    // Default image formats
    formats: ['image/webp'],
    // Increase minimum cache TTL for better performance
    minimumCacheTTL: 60 * 60, // 1 hour
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Improve performance by enabling SWC minification
  swcMinify: true,
  // Performance optimizations
  experimental: {
    // Optimize package imports for better performance
    optimizePackageImports: ['react-icons', 'framer-motion'],
  },
  // Configure headers for better security
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          // Prevent browsers from incorrectly detecting non-scripts as scripts
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevent embedding as iframe on other sites
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
