import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    proxy: {
      "/api": {
        // target: "http://localhost:8000",
        target: "https://qi-backend-staging-bkatd9dxecfvbmh4.westeurope-01.azurewebsites.net",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    commonjsOptions: {
      include: [/ccxt/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [
        // Node.js built-in modules that CCXT tries to use
        'node:http',
        'node:https',
        'node:net',
        'node:tls',
        'node:url',
        'node:util',
        'node:stream',
        'node:buffer',
        'node:zlib',
        'node:dns',
        'http',
        'https',
        'net',
        'tls',
        'url',
        'util',
        'stream',
        'buffer',
        'zlib',
        'dns',
        'assert',
        'fs',
        'path',
        'os',
        'crypto',
        'querystring',
        'events',
        'child_process',
        'cluster',
        'worker_threads',
        'vm',
        'v8',
        'perf_hooks',
        'async_hooks',
        'timers',
        'punycode',
        'readline',
        'repl',
        'string_decoder',
        'tty',
        'domain',
        'constants',
        'freelist',
        'smalloc',
        'sys',
        'nextTick',
        'process',
        'global',
        'Buffer',
        'console',
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'setImmediate',
        'clearImmediate'
      ],
    },
  },
  define: {
    global: 'globalThis',
    'process.env': '{}',
    'process.version': '"v16.0.0"',
    'process.platform': '"browser"',
    'process.nextTick': 'setTimeout',
    'Buffer': 'undefined',
  },
  optimizeDeps: {
    include: ['ccxt'],
    exclude: [],
  },
}));
