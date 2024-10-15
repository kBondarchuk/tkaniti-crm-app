import { defineConfig, searchForWorkspaceRoot, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import process from "node:process";
import { fileURLToPath } from "url";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  console.log(env);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        minify: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "#": path.resolve(__dirname, "./src/components"),
        "%": path.resolve(__dirname, "./src/@crmkit"),
      },
      dedupe: ["vue"],
    },
    build: {
      cssCodeSplit: false,
      outDir: env.VITE_BUILD_DIR,
      // assetsInlineLimit: 100000000,
      // outputOptions: {
      //   inlineDynamicImports: true,
      // },
      // rollupOptions: {
      //   output: {
      //     manualChunks: () => "everything.js",
      //   },
      // },
    },
    envPrefix: "VUE_APP",
    server: {
      fs: {
        allow: [
          // search up for workspace root
          searchForWorkspaceRoot(process.cwd()),
          // your custom rules
          "/src/components",
        ],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or "modern"
        },
      },
    },
  };
});
