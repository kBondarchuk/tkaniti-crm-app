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
      htmlPlugin(env),
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

/**
 * Replace env variables in index.html
 * @see https://github.com/vitejs/vite/issues/3105#issuecomment-939703781
 * @see https://vitejs.dev/guide/api-plugin.html#transformindexhtml
 */
function htmlPlugin(env) {
  return {
    name: "html-transform",
    transformIndexHtml: {
      enforce: "pre",
      transform: (html) => html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match),
    },
  };
}
