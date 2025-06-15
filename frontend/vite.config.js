// vite.config.js
import { defineConfig } from 'vite'
import angular from '@angular-devkit/build-angular'

export default defineConfig({
    plugins: [angular()],
    server: {
        host: '0.0.0.0',
        allowedHosts: [
            'all'
        ]
    }
})