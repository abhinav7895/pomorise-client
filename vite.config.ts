
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: 'prompt' as const,
  includeAssets: ['favicon.ico', "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Pomorise Timer",
    short_name: "Pomorise",
    description: "A productivity timer with task and habit tracking",
    start_url: "/",
    display: "standalone" as const,
    background_color: "#000000",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: "/icons/logo.png",
        sizes: "128x128",
        type: "image/png"
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "152x152",
        type: "image/png"
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "384x384",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
  }
};


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(), VitePWA(manifestForPlugIn)
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
}));
