import { defineConfig } from "vite"
import dlight from "vite-plugin-dlight"
import path from "path"

const entry = process.env.VITE_ENTRY || "index.html"

export default defineConfig({
  root: path.resolve(__dirname, path.dirname(entry)),
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, entry),
    },
  },
  plugins: [dlight({ files: "**/*.{view,model}.ts" })],
})
