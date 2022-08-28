<template>
    <table class="table table-compact w-full">
        <thead>
            <tr>
                <th class="w-min"></th>
                <th class="w-full">Name</th>
                <th class="w-min">Edit</th>
                <th class="w-min">Delete</th>
            </tr>
        </thead>
        <Draggable tag="tbody" :list="CardStore.cards" handle=".drag-handle" ghost-class="opacity-50">
            <tr v-for="card in CardStore.cards" :key="card.id" class="hover">
                <td class="drag-handle">
                    <Icon name="md-dragindicator"></Icon>
                </td>
                <td>{{ card.name }}</td>
                <td>
                    <label
                        :for="props.label"
                        class="btn btn-sm btn-square btn-ghost"
                        @click="() => onEditClick(card.id)"
                    >
                        <Icon name="md-edit"></Icon>
                    </label>
                </td>
                <td>
                    <button
                        class="btn btn-sm btn-square btn-ghost hover:btn-error"
                        @click="() => onDeleteClick(card.id)"
                    >
                        <Icon name="md-delete"></Icon>
                    </button>
                </td>
            </tr>
        </Draggable>
    </table>
</template>
<script setup lang="ts">
import useCards from "../store/cardStore";
import { VueDraggableNext as Draggable } from "vue-draggable-next";

const CardStore = useCards();

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
    CardStore.deleteByID(id);
};
</script>
