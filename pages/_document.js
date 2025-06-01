import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <title>8000000 - 神社参拝習慣化アプリ</title>
        <meta name="description" content="毎日の神社参拝を楽しく継続。NFT御朱印やレア報酬で習慣化をサポート" />
        
        {/* Critical CSS inlined */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical Path CSS */
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              
              html {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans JP', sans-serif;
                line-height: 1.6;
                -webkit-text-size-adjust: 100%;
                text-size-adjust: 100%;
              }
              
              body {
                background-color: #f8f9fa;
                color: #1d1d1f;
                overflow-x: hidden;
                min-height: 100vh;
                font-size: 16px;
                line-height: 1.6;
              }
              
              /* Loading skeleton for immediate feedback */
              .loading-skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading-shimmer 1.5s infinite;
                border-radius: 4px;
              }
              
              @keyframes loading-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
              
              /* Critical navigation styles */
              .mobile-tab-navigation {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 60px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-top: 0.5px solid rgba(0, 0, 0, 0.1);
                z-index: 1000;
                padding-bottom: env(safe-area-inset-bottom);
              }
              
              /* Accessibility - Skip links */
              .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                border-radius: 0 0 4px 0;
                z-index: 10000;
                transition: top 0.3s;
              }
              
              .skip-link:focus {
                top: 0;
              }
              
              /* Dark mode support */
              @media (prefers-color-scheme: dark) {
                body {
                  background-color: #000000;
                  color: #ffffff;
                }
                
                .mobile-tab-navigation {
                  background: rgba(28, 28, 30, 0.95);
                  border-top-color: rgba(255, 255, 255, 0.1);
                }
                
                .loading-skeleton {
                  background: linear-gradient(90deg, #2c2c2e 25%, #3a3a3c 50%, #2c2c2e 75%);
                  background-size: 200% 100%;
                }
              }
              
              /* Reduced motion support */
              @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                  animation-duration: 0.01ms !important;
                  animation-iteration-count: 1 !important;
                  transition-duration: 0.01ms !important;
                  scroll-behavior: auto !important;
                }
              }
              
              /* High contrast support */
              @media (prefers-contrast: high) {
                body {
                  background: #fff;
                  color: #000;
                }
                
                .mobile-tab-navigation {
                  background: #fff;
                  border-top: 2px solid #000;
                }
              }
              
              /* Focus visible polyfill */
              .js-focus-visible :focus:not(.focus-visible) {
                outline: none;
              }
              
              .focus-visible {
                outline: 2px solid #007AFF;
                outline-offset: 2px;
              }
            `,
          }}
        />
        
        {/* Resource hints */}
        <link rel="preload" href="/fonts/NotoSansJP-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/icons/shrine-icon.svg" as="image" />
        
        {/* Favicon and touch icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#007AFF" />
        
        {/* Microsoft tiles */}
        <meta name="msapplication-TileColor" content="#007AFF" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </Head>
      <body>
        {/* No-JS fallback */}
        <noscript>
          <div style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#ff6b35',
            color: 'white',
            fontWeight: 'bold'
          }}>
            このアプリをご利用いただくには、JavaScriptを有効にしてください。
          </div>
        </noscript>
        
        <Main />
        <NextScript />
        
        {/* Focus visible polyfill for older browsers */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                if (typeof window !== 'undefined' && !window.CSS?.supports?.('selector(:focus-visible)')) {
                  var script = document.createElement('script');
                  script.src = 'https://unpkg.com/focus-visible@5.2.0/dist/focus-visible.min.js';
                  script.async = true;
                  document.head.appendChild(script);
                }
              })();
            `,
          }}
        />
      </body>
    </Html>
  );
}