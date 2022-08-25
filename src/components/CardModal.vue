<template>
    <teleport to="body">
        <input type="checkbox" :checked="props.open" :id="props.label" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box relative">
                <label :for="props.label" class="btn btn-sm btn-circle absolute right-2 top-2" @click="closeBtnClick">
                    <Icon name="md-close"></Icon>
                </label>
                <h3 class="text-lg font-bold">{{ props.title }}</h3>
                <div class="">
                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            v-model="name"
                            placeholder="Type here"
                            class="input input-bordered w-full max-w-xs"
                        />
                    </div>
                </div>
                <div class="modal-action">
                    <label :for="props.label" class="btn btn-sm btn-primary" @click="saveBtnClick">Save</label>
                </div>
            </div>
        </div>
    </teleport>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { CardValidator } from "../types/validators";

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
        default: "Create new card",
    },
});

const name = ref("");

const emit = defineEmits<{
    (e: "close"): void;
    (e: "save", data: z.input<typeof CardValidator>): void;
}>();

const closeBtnClick = () => {
    emit("close");
    name.value = "";
};

const saveBtnClick = () => {
    emit("save", {
        name: name.value,
    });
    name.value = "";
    emit("close");
};
</script>
