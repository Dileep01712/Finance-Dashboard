// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from "path"

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }]
// })

// vite.config.ts
import { defineConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path"

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
