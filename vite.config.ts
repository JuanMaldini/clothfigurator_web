import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use a special mode for GitHub Pages so Vercel remains unaffected
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "gh" ? "/clothfigurator_web/" : "/",
}));
