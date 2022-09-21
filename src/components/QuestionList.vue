<template>
    <table class="table table-compact w-full table-fixed">
        <thead>
            <tr>
                <th class="w-max">{{ $t("timestamp") }}</th>
                <th class="">{{ $t("asking") }}</th>
                <th class="">{{ $t("answering") }}</th>
                <th class="w-min">{{ $t("suspect") }} + {{ $t("weapon") }} + {{ $t("location") }}</th>
                <th class="">{{ $t("edit") }}</th>
                <th class="">{{ $t("delete") }}</th>
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
