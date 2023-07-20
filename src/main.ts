import App from "./App.vue";
import de from "./locales/de.json";
import en from "./locales/en.json";
import "./style.css";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
    MdAdd,
    MdArrowback,
    MdArrowforward,
    MdCheck,
    MdClose,
    MdDelete,
    MdDragindicator,
    MdEdit,
    MdFileopen,
    MdMenu,
    MdNoteadd,
    MdSave,
} from "oh-vue-icons/icons";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";

dayjs.extend(localizedFormat);

// TODO: replace oh-vue-icons with unocss icons
addIcons(
    MdClose,
    MdMenu,
    MdEdit,
    MdDelete,
    MdSave,
    MdNoteadd,
    MdFileopen,
    MdCheck,
    MdDragindicator,
    MdAdd,
    MdArrowback,
    MdArrowforward,
);

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

createApp(App).component("Icon", OhVueIcon).use(pinia).use(router).use(i18n).mount("#app");
