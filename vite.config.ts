import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const outputDir = "dist";

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },

    plugins: [
        svelte(),

        viteStaticCopy({
            targets: [
                { src: "./README.md", dest: "./" },
                { src: "./plugin.json", dest: "./" },
                { src: "./preview.png", dest: "./" },
                { src: "./icon.png", dest: "./" },
            ],
        }),
    ],

    build: {
        outDir: outputDir,
        emptyOutDir: true,
        minify: true,

        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            fileName: "index",
            formats: ["cjs"],
        },
        rollupOptions: {
            external: ["siyuan", "process"],
            output: {
                inlineDynamicImports: true,
                entryFileNames: "[name].js",
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === "style.css") {
                        return "index.css";
                    }
                    return assetInfo.name;
                },
            },
        },
    },
});
