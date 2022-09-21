import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
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
});
