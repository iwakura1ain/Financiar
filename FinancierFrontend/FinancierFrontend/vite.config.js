import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import {StockAPIRoute} from "./src/APIRoutes.jsx"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react()
    ],
    server: {
        host: true,
        proxy: {
            // "/api/something" --rewrite--> "http://api.github.com/something"
            '/api': {
                target: StockAPIRoute,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, 'http://financiar-backend:8000/api'),
                secure: false,
                ws: true
            }
        }
    }
});
