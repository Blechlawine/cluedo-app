<template>
    <table class="table table-compact w-full">
        <thead>
            <tr>
                <th>Timestamp</th>
                <th>Asking</th>
                <th>Answering</th>
                <th>Suspect</th>
                <th>Weapon</th>
                <th>Location</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tr v-for="question in QuestionStore.questions" class="hover" :key="question.id">
            <QuestionListRow :question="question"></QuestionListRow>
            <td>
                <label
                    :for="props.label"
                    class="btn btn-sm btn-square btn-ghost"
                    @click="() => onEditClick(question.id)"
                >
                    <Icon name="md-edit"></Icon>
                </label>
            </td>
            <td>
                <button
                    class="btn btn-sm btn-square btn-ghost hover:btn-error"
                    @click="() => onDeleteClick(question.id)"
                >
                    <Icon name="md-delete"></Icon>
                </button>
            </td>
        </tr>
    </table>
</template>
<script setup lang="ts">
import QuestionListRow from "./QuestionListRow.vue";
import useQuestions from "../store/questionStore";

const QuestionStore = useQuestions();

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
    QuestionStore.deleteByID(id);
};
</script>
