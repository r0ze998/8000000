/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel最適化設定
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // 画像最適化
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['localhost', 'shrine-images.vercel.app'],
    minimumCacheTTL: 31536000, // 1年
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // バンドル最適化
  webpack: (config, { dev, isServer, webpack }) => {
    // 本番環境でのバンドル分析
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 100000, // 100KB制限
        cacheGroups: {
          // フレームワークコード
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // ライブラリコード
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'commons',
            priority: 30,
            chunks: 'all',
            maxSize: 80000,
          },
          // 共通コンポーネント
          common: {
            name: 'common',
            minChunks: 2,
            priority: 20,
            chunks: 'all',
            maxSize: 60000,
          },
          // ページ固有コード
          pages: {
            name: 'pages',
            chunks: 'all',
            priority: 10,
            maxSize: 50000,
          }
        },
      };

      // Tree shakingの強化
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    // Service Worker対応
    if (!isServer && !dev) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.SW_ENABLED': JSON.stringify(true),
        })
      );
    }

    return config;
  },

  // 静的ファイル最適化
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // ISR設定
  async rewrites() {
    return [
      {
        source: '/shrine/:slug*',
        destination: '/shrine/[slug]',
      },
      {
        source: '/api/shrines/:path*',
        destination: '/api/shrines/:path*',
      }
    ];
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Build最適化
  swcMinify: true,
  modularizeImports: {
    'react-icons': {
      transform: 'react-icons/{{member}}',
    },
  },


  // 開発時の最適化
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
};

module.exports = nextConfig;