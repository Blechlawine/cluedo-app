import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createI18n } from "vue-i18n";
import de from "./locales/de.json";
import en from "./locales/en.json";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
    MdClose,
    MdEdit,
    MdDelete,
    MdSave,
    MdNoteadd,
    MdFileopen,
    MdCheck,
    MdDragindicator,
    MdAdd,
    MdMenu,
} from "oh-vue-icons/icons";
addIcons(MdClose, MdMenu, MdEdit, MdDelete, MdSave, MdNoteadd, MdFileopen, MdCheck, MdDragindicator, MdAdd);

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

createApp(App).component("Icon", OhVueIcon).use(pinia).use(i18n).mount("#app");
