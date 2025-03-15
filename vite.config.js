import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Добавляем модуль path для работы с путями

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Указываем расширения файлов, которые Vite должен обрабатывать
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // Настраиваем псевдонимы для упрощения импортов (опционально)
    alias: {
      '@': path.resolve(__dirname, './src'), // Позволяет использовать абсолютные пути, например, '@/components/Todo/Todo.jsx'
    },
  },
  server: {
    // Устанавливаем строгую проверку путей на сервере разработки
    fs: {
      strict: true, // Запрещает доступ к файлам вне корня проекта
    },
  },
});