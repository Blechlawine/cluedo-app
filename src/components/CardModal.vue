<template>
    <teleport to="body">
        <input type="checkbox" :checked="props.open" :id="props.label" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box relative">
                <label
                    :for="props.label"
                    class="btn btn-sm btn-circle absolute right-2 top-2"
                    @click="closeBtnClick"
                >
                    <div class="i-tabler-x"></div>
                </label>
                <h3 class="text-lg font-bold">{{ props.title ?? $t("create-new-card") }}</h3>
                <div class="">
                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">{{ $t("name") }}</span>
                        </label>
                        <input
                            type="text"
                            v-model="name"
                            :placeholder="$t('type-here')"
                            class="input input-bordered w-full max-w-xs"
                        />
                    </div>
                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">{{ $t("category") }}</span>
                        </label>
                        <select class="select select-bordered" v-model="category">
                            <option disabled selected>{{ $t("pick-one") }}</option>
                            <option
                                v-for="category in ['suspect', 'weapon', 'location']"
                                :key="category"
                                :value="category"
                            >
                                {{ $t(category) }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="modal-action">
                    <label :for="props.label" class="btn btn-sm btn-primary" @click="saveBtnClick">
                        {{ $t("save") }}
                    </label>
                </div>
            </div>
        </div>
    </teleport>
</template>
<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import { CardInput, CardOutput } from "../types/validators";

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    presetValues: {
        type: Object as PropType<null | CardOutput>,
        default: null,
    },
});

watch(
    () => props.presetValues,
    () => {
        if (props.presetValues) {
            name.value = props.presetValues.name;
            category.value = props.presetValues.category;
        } else {
            name.value = "";
            category.value = "suspect";
        }
    },
    {
        deep: true,
    },
);

const name = ref("");
const category = ref<CardOutput["category"]>("suspect");

const emit = defineEmits<{
    (e: "close"): void;
    (e: "save", data: CardInput): void;
}>();

const closeBtnClick = () => {
    emit("close");
    name.value = "";
    category.value = "suspect";
};

const saveBtnClick = () => {
    emit("save", {
        ...props.presetValues,
        name: name.value,
        category: category.value,
    });
    name.value = "";
    emit("close");
};
</script>
