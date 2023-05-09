/** @type {import('next').NextConfig} */

if (!process.env.NEXTAUTH_SECRET) throw new Error('Please set NEXTAUTH_SECRET');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },

  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = {};
module.exports = withBundleAnalyzer(nextConfig);
