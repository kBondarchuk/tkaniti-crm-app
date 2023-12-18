import { defineConfig, searchForWorkspaceRoot, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  console.log(env);

  return {
    // plugins: [createVuePlugin()],
    plugins: [
      vue(),
      // htmlPlugin(env),
      // vue({
      //   template: {
      //     compilerOptions: {
      //       compatConfig: {
      //         MODE: 2,
      //       },
      //     },
      //   },
      // }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // vue: "@vue/compat",
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
  };
});
