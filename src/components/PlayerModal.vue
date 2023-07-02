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
                    <Icon name="md-close" />
                </label>
                <h3 class="text-lg font-bold">{{ props.title ?? $t("create-new-player") }}</h3>
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
                            <span class="label-text">{{ $t("amount-of-cards") }}</span>
                        </label>
                        <input
                            type="number"
                            v-model="cardAmount"
                            :placeholder="$t('type-here')"
                            class="input input-bordered w-full max-w-xs"
                        />
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
import { PlayerInput, PlayerOutput } from "../types/validators";

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
        type: Object as PropType<PlayerOutput | null>,
        default: null,
    },
});

watch(
    () => props.presetValues,
    () => {
        if (props.presetValues) {
            name.value = props.presetValues.name;
            cardAmount.value = props.presetValues.cardAmount;
        } else {
            name.value = "";
            cardAmount.value = 0;
        }
    },
    {
        deep: true,
    }
);

const emit = defineEmits<{
    (e: "close"): void;
    (e: "save", data: PlayerInput): void;
}>();

const name = ref("");
const cardAmount = ref(0);

const closeBtnClick = () => {
    emit("close");
    name.value = "";
    cardAmount.value = 0;
};

const saveBtnClick = () => {
    emit("save", {
        ...props.presetValues,
        name: name.value,
        cardAmount: cardAmount.value,
    });
    name.value = "";
    cardAmount.value = 0;
    emit("close");
};
</script>
