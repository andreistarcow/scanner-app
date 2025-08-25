import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const DEXCELERATE_API = 'https://api-rs.dexcelerate.com';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_API_URL || DEXCELERATE_API;

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      port: 1337,
      proxy: {
        '/api': { target: API_URL, changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
        '/ws':  { target: API_URL, ws: true, changeOrigin: true, secure: true, rewrite: () => '/ws' },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  };
});
