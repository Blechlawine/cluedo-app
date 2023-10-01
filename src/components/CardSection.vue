<template>
    <div class="cards flex flex-col border-r-2 border-base-300 overflow-auto">
        <div
            class="flex flex-row justify-between items-center sticky p-2 top-0 left-0 z-10 bg-base-100"
        >
            <h1>{{ $t("cards") }}</h1>
            <label for="cardModal" class="btn btn-sm modal-button flex gap-1 pl-2">
                <Icon name="md-add"></Icon>
                {{ $t("card") }}
            </label>
        </div>
        <CardModal
            :open="cardModalOpen"
            label="cardModal"
            @save="onCardModalSave"
            @close="onCardModalClose"
            :preset-values="cardModalPresetValues"
        />
        <CardList label="cardModal" @edit-item="onCardListEditItem" />
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import useCards from "../store/cardStore";
import type { CardInput, CardOutput } from "../types/validators";
import CardList from "./CardList.vue";
import CardModal from "./CardModal.vue";
import { useI18n } from "vue-i18n";

const cardModalOpen = ref(false);
const cardModalPresetValues = ref<CardOutput | null>(null);

const CardStore = useCards();

const onCardModalClose = () => {
    cardModalPresetValues.value = null;
};

const onCardListEditItem = (cardId: string) => {
    cardModalPresetValues.value = CardStore.getByID(cardId) ?? null;
};

const onCardModalSave = (data: CardInput) => {
    CardStore.upsert(data);
};
</script>
