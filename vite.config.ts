import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Pages(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "Cluedo-app",
                short_name: "Cluedoapp",
                description: "Cluedo-app",
                icons: [
                    {
                        src: "/vite.svg",
                        sizes: "144x144",
                    },
                ],
            },
        }),
    ],
    server: {
        proxy: {
            "/api": "http://127.0.0.1:3000",
        },
    },
});
