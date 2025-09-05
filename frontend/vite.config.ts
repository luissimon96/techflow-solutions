import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// 🚀 Vite Config - Performance Optimized Build
// ✅ Bundle analysis with rollup-plugin-visualizer
// ✅ Enhanced code splitting configuration
// ✅ Build optimizations for production
// ✅ Security headers and CSP

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analysis in production builds
    process.env.NODE_ENV === 'production' && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://techflow-solutions-backend.onrender.com'
          : 'http://localhost:3000',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
    headers: {
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      // Content Security Policy (desenvolvimento)
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: wss: https://techflow-solutions-backend.onrender.com;"
    }
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    
    // ✅ Performance: Chunk size warnings and asset optimization
    chunkSizeWarningLimit: 1000, // 1MB warning threshold
    assetsInlineLimit: 4096, // 4KB inline threshold
    rollupOptions: {
      output: {
        manualChunks: {
          // ✅ Performance: Optimized chunk splitting
          vendor: ['react', 'react-dom'],
          ui: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          router: ['react-router-dom', 'react-helmet-async'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          query: ['@tanstack/react-query'],
          icons: ['react-icons'],
        },
        
        // ✅ Performance: Optimize asset naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          let extType = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          
          return `assets/${extType}/[name]-[hash].[ext]`;
        },
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
  },
  // ✅ Performance: Development optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@chakra-ui/react',
      'framer-motion',
      'react-router-dom',
      'zod',
      '@tanstack/react-query',
    ],
  },
})
