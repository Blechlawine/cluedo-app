<template>
    <table class="table table-compact w-full table-fixed">
        <thead>
            <tr>
                <th class="">Timestamp</th>
                <th class="">Asking</th>
                <th class="">Answering</th>
                <th class="w-min">Suspect</th>
                <th class="w-min">Weapon</th>
                <th class="w-min">Location</th>
                <th class="w-min">Edit</th>
                <th class="w-min">Delete</th>
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
