import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssTarget: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          ethers: ['ethers'],
          react: ['react', 'react-dom'],
          lucide: ['lucide-react'],
        },
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
})
