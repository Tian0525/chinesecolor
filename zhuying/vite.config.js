import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base './' + singlefile：构建产物为单个自包含 index.html，双击 file:// 即可打开
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
})
