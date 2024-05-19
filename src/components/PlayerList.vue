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
                    <div class="i-tabler-grip-vertical"></div>
                </td>
                <td class="whitespace-nowrap text-ellipsis overflow-hidden">{{ player.name }}</td>
                <td>{{ player.cardAmount }}</td>
                <td>
                    <label
                        :for="props.label"
                        class="btn btn-sm btn-square btn-ghost"
                        @click="emit('editItem', player.id)"
                    >
                        <div class="i-tabler-pencil"></div>
                    </label>
                </td>
                <td>
                    <button
                        class="btn btn-sm btn-square btn-ghost hover:btn-error"
                        @click="PlayerStore.deleteByID(player.id)"
                    >
                        <div class="i-tabler-trash"></div>
                    </button>
                </td>
            </tr>
        </Draggable>
    </table>
</template>
<script setup lang="ts">
import { VueDraggableNext as Draggable } from "vue-draggable-next";
import usePlayers from "../store/playerStore";

const PlayerStore = usePlayers();

const props = defineProps<{
    label: string;
}>();

const emit = defineEmits<(e: "editItem", id: string) => void>();
</script>
