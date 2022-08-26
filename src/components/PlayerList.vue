<template>
    <table class="table table-compact w-full">
        <thead>
            <tr>
                <th>Name</th>
                <th>Card-amount</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="player in PlayerStore.players" class="hover" :key="player.id">
                <td>{{ player.name }}</td>
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
                    <button class="btn btn-sm btn-square btn-ghost" @click="() => onDeleteClick(player.id)">
                        <Icon name="md-delete"></Icon>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script setup lang="ts">
import usePlayers from "../store/playerStore";

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