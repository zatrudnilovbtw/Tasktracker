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
    host: '0.0.0.0', // Позволяет внешний доступ
    port: 5173, // Убедитесь, что это ваш целевой порт
    allowedHosts: [
      'localhost',
      '.ngrok-free.app', // Разрешает все поддомены ngrok
    ],
  },
});