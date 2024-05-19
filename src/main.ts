import App from "./App.vue";
import de from "./locales/de.json";
import en from "./locales/en.json";
import "./style.css";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";

dayjs.extend(localizedFormat);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const i18n = createI18n({
    locale: "en",
    fallbackLocale: "en",
    legacy: false,
    messages: {
        en,
        de,
    },
});

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(pinia).use(router).use(i18n).mount("#app");
