import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdClose } from "oh-vue-icons/icons";
addIcons(MdClose);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).component("Icon", OhVueIcon).use(pinia).mount("#app");
