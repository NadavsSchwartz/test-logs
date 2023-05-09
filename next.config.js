// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */

if (!process.env.NEXTAUTH_SECRET) throw new Error('Please set NEXTAUTH_SECRET');
const plugins = [];

const nextConfig = {
  productionBrowserSourceMaps: true,
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
  typescript: {
    ignoreBuildErrors: !!process.env.CI,
  },
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  modularizeImports: {
    'react-icons/fi': {
      transform: 'react-icons/fi/{{member}}',
    },
    'react-icons/ai': {
      transform: 'react-icons/ai/{{member}}',
    },
    'react-icons/md': {
      transform: 'react-icons/md/{{member}}',
    },
    'react-icons/fa': {
      transform: 'react-icons/fa/{{member}}',
    },
    'react-icons/io': {
      transform: 'react-icons/io/{{member}}',
    },
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

if (process.env.ANALYZE === 'true') {
  // only load dependency if env `ANALYZE` was set
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  plugins.push(withBundleAnalyzer);
}

const moduleExports = plugins.reduce(
  (config, plugin) => plugin(config),
  nextConfig
);

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  nextConfig.sentry = {
    hideSourceMaps: true,
    // Prevents Sentry from running on this Edge function, where Sentry doesn't work yet (build whould crash the api route).
    excludeServerRoutes: [/\/api\//],
  };
}
// Sentry should be the last thing to export to catch everything right
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(moduleExports)
  : moduleExports;
