import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './client/test/setup.ts',
  },
})
