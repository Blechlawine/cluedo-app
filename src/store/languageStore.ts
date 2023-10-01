import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const useLanguages = defineStore(
    "languages",
    () => {
        const locale = ref<"en" | "de">("en");

        const I18n = useI18n();

        watch(locale, () => {
            I18n.locale.value = locale.value;
        });

        return {
            locale,
        };
    },
    {
        persist: {
            paths: ["locale"],
        },
    },
);
export default useLanguages;
