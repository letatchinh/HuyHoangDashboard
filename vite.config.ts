import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server:{
    host:'0.0.0.0',
    port: 3000
  },
  resolve:{
    alias:{
        '*': path.resolve(__dirname, 'node_modules','@types'),
        '~/api': path.resolve(__dirname, 'src','api'),
        '~/constants': path.resolve(__dirname, 'src','constants'),
        '~/modules': path.resolve(__dirname, 'src','modules'),
        '~/pages': path.resolve(__dirname, 'src','pages'),
        '~/redux': path.resolve(__dirname, 'src','redux'),
        '~/store': path.resolve(__dirname, 'src','store'),
        '~/styles': path.resolve(__dirname, 'src','styles'),
        '~/utils': path.resolve(__dirname, 'src','utils'),
        '~/components': path.resolve(__dirname, 'src','components'),
        '~/lib': path.resolve(__dirname, 'src','lib'),
        '~/core': path.resolve(__dirname, 'src','core'),
        '~/routes': path.resolve(__dirname, 'src','routes'),
        '~/assets': path.resolve(__dirname, 'src','assets'),
        '~/locales': path.resolve(__dirname, 'src','locales'),
    }
  }
})
