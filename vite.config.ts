
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // تعريف process.env لمنع الأخطاء في الكود الذي يعتمد عليه
    'process.env': process.env
  }
});
