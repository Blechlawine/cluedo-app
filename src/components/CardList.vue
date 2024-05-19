<template>
    <table class="table table-compact w-full table-fixed">
        <thead>
            <tr>
                <th class="w-6"></th>
                <th class="w-full">{{ $t("name") }}</th>
                <th class="w-min">{{ $t("edit") }}</th>
                <th class="w-min">{{ $t("delete") }}</th>
            </tr>
        </thead>
        <Draggable
            tag="tbody"
            :list="CardStore.cards"
            handle=".drag-handle"
            ghost-class="opacity-50"
        >
            <tr v-for="card in CardStore.cards" :key="card.id" class="hover">
                <td class="drag-handle">
                    <div class="i-tabler-grip-vertical"></div>
                </td>
                <td class="whitespace-nowrap text-ellipsis overflow-hidden">{{ card.name }}</td>
                <td>
                    <label
                        :for="props.label"
                        class="btn btn-sm btn-square btn-ghost"
                        @click="() => onEditClick(card.id)"
                    >
                        <div class="i-tabler-pencil"></div>
                    </label>
                </td>
                <td>
                    <button
                        class="btn btn-sm btn-square btn-ghost hover:btn-error"
                        @click="() => onDeleteClick(card.id)"
                    >
                        <div class="i-tabler-trash"></div>
                    </button>
                </td>
            </tr>
        </Draggable>
    </table>
    <div class="p-2 flex flex-row gap-2 items-center justify-center" v-if="!CardStore.cards.length">
        <!-- <button @click="addSuperCluedoCards" class="btn btn-sm">
            <div class="i-tabler-plus"></div>
            Super Cluedo
        </button> -->
        <button @click="addCluedoCards" class="btn btn-sm">
            <div class="i-tabler-plus"></div>
            Cluedo
        </button>
    </div>
</template>
<script setup lang="ts">
import { VueDraggableNext as Draggable } from "vue-draggable-next";
import { useI18n } from "vue-i18n";
import useCards from "../store/cardStore";
import type { CardInput } from "../types/validators";

const CardStore = useCards();
const { t } = useI18n();

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
});

const emit = defineEmits<(e: "editItem", id: string) => void>();

const onEditClick = (id: string) => {
    emit("editItem", id);
};

const onDeleteClick = (id: string) => {
    CardStore.deleteByID(id);
};

function addSuperCluedoCards() {}
function addCluedoCards() {
    const cards = [
        { name: t("cardName.suspect.red"), category: "suspect" },
        { name: t("cardName.suspect.blue"), category: "suspect" },
        { name: t("cardName.suspect.green"), category: "suspect" },
        { name: t("cardName.suspect.yellow"), category: "suspect" },
        { name: t("cardName.suspect.white"), category: "suspect" },
        { name: t("cardName.suspect.purple"), category: "suspect" },
        { name: t("cardName.weapon.dagger"), category: "weapon" },
        { name: t("cardName.weapon.pipe"), category: "weapon" },
        { name: t("cardName.weapon.revolver"), category: "weapon" },
        { name: t("cardName.weapon.spanner"), category: "weapon" },
        { name: t("cardName.weapon.light"), category: "weapon" },
        { name: t("cardName.weapon.rope"), category: "weapon" },
        { name: t("cardName.location.hall"), category: "location" },
        { name: t("cardName.location.lounge"), category: "location" },
        { name: t("cardName.location.diningroom"), category: "location" },
        { name: t("cardName.location.kitchen"), category: "location" },
        { name: t("cardName.location.conservatory"), category: "location" },
        { name: t("cardName.location.ballroom"), category: "location" },
        { name: t("cardName.location.billiardroom"), category: "location" },
        { name: t("cardName.location.library"), category: "location" },
        { name: t("cardName.location.study"), category: "location" },
    ] as CardInput[];
    CardStore.insertMany(cards);
}
</script>
