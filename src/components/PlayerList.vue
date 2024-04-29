<template>
    <table class="table table-compact w-full table-fixed">
        <thead>
            <tr>
                <th class="w-6"></th>
                <th class="w-1/2">{{ $t("name") }}</th>
                <th class="w-1/2">{{ $t("cards") }}</th>
                <th class="w-min">{{ $t("edit") }}</th>
                <th class="w-min">{{ $t("delete") }}</th>
            </tr>
        </thead>
        <Draggable
            tag="tbody"
            handle=".drag-handle"
            :list="PlayerStore.players"
            ghost-class="opacity-50"
        >
            <tr v-for="player in PlayerStore.players" class="hover" :key="player.id">
                <td class="drag-handle">
                    <Icon name="md-dragindicator"></Icon>
                </td>
                <td class="whitespace-nowrap text-ellipsis overflow-hidden">{{ player.name }}</td>
                <td>{{ player.cardAmount }}</td>
                <td>
                    <label
                        :for="props.label"
                        class="btn btn-sm btn-square btn-ghost"
                        @click="() => onEditClick(player.id)"
                    >
                        <Icon name="md-edit"></Icon>
                    </label>
                </td>
                <td>
                    <button
                        class="btn btn-sm btn-square btn-ghost hover:btn-error"
                        @click="() => onDeleteClick(player.id)"
                    >
                        <Icon name="md-delete"></Icon>
                    </button>
                </td>
            </tr>
        </Draggable>
    </table>
</template>
<script setup lang="ts">
import usePlayers from "../store/playerStore";
import { VueDraggableNext as Draggable } from "vue-draggable-next";

const PlayerStore = usePlayers();

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
});

const emit = defineEmits<{
    (e: "editItem", id: string): void;
}>();

const onEditClick = (id: string) => {
    emit("editItem", id);
};

const onDeleteClick = (id: string) => {
    PlayerStore.deleteByID(id);
};
</script>
