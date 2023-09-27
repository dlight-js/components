import { defineConfig } from "vite"
import dlight from "vite-plugin-dlight"
import easyCss from "vite-plugin-easy-css"

export default defineConfig({
  server: {
    port: 5932
  },
  base: "",
  plugins: [
    easyCss({ files: "**/*.view.ts" }),
    dlight({ files: "**/*.view.ts" })
  ]
})
