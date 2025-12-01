import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                silenceDeprecations: ['import', 'color-functions'],
            },
        },
    },
    server: {
        port: 3000,      // 👈 change this to whatever you want
        // strictPort: true, // optional: fail instead of picking another port
        proxy: {
            // Any request starting with /api will be proxied to the backend
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                // optional: remove /api prefix if your backend doesn't expect it
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
        cors: false
    },
})
