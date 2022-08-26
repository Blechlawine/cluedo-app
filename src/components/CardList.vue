<template>
    <table class="table table-compact w-full">
        <thead>
            <tr>
                <th>Name</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <Draggable tag="tbody" :list="CardStore.cards" ghost-class="opacity-50">
            <tr v-for="card in CardStore.cards" class="hover" :key="card.id">
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