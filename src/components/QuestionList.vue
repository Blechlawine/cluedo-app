<template>
    <table class="table table-pin-rows w-full table-fixed">
        <thead>
            <tr>
                <th class="w-max">{{ $t("timestamp") }}</th>
                <th class="w-min">{{ $t("asking") }}</th>
                <th class="w-min">{{ $t("answering") }}</th>
                <th class="w-max">
                    {{ $t("suspect") }} + {{ $t("weapon") }} + {{ $t("location") }}
                </th>
                <th class="w-min">{{ $t("edit") }} / {{ $t("delete") }}</th>
            </tr>
        </thead>
        <tr v-for="question in QuestionStore.questions" class="hover" :key="question.id">
            <QuestionListRow :question="question"></QuestionListRow>
            <td class="flex flex-row gap-2 items-center">
                <button
                    :onclick="`${props.label}.showModal()`"
                    class="btn btn-sm btn-square btn-ghost"
                    @click="() => onEditClick(question.id)"
                >
                    <div class="i-tabler-pencil"></div>
                </button>
                <button
                    class="btn btn-sm btn-square btn-ghost hover:btn-error"
                    @click="() => onDeleteClick(question.id)"
                >
                    <div class="i-tabler-trash"></div>
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
