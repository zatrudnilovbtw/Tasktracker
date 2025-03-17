import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      strict: true,
    },
    allowedHosts: [
      'ad3a-195-158-193-250.ngrok-free.app', // Add the new ngrok URL here
      'localhost',
    ],
    host: '0.0.0.0', // Allows external access
    port: 5173, // Ensure this matches your intended port
  },
});