import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [wasm(), topLevelAwait(), reactRouter(), tsconfigPaths()],
  envPrefix: "PUBLIC_",
  ssr: {
    // Prevents SSR to import CJS module of maplibre-gl, instead of ESM.
    noExternal: ['maplibre-gl'],
  },
});
