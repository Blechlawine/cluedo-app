<script setup lang="ts">
import PlayerSection from "../components/PlayerSection.vue";
import CardSection from "../components/CardSection.vue";
import QuestionList from "../components/QuestionList.vue";
import QuestionModal from "../components/QuestionModal.vue";
import type { QuestionInput, QuestionOutput } from "../types/validators";
import { ref } from "vue";
import useQuestions from "../store/questionStore";
import MainTable from "../components/MainTable.vue";
import Toolbar from "../components/Toolbar.vue";
import useGameDataStore from "../store/gameDataStore";

const QuestionStore = useQuestions();
const GameDataStore = useGameDataStore();

const questionModalOpen = ref(false);
const questionModalPresetValues = ref<QuestionOutput | null>(null);

const onQuestionModalClose = () => {
    questionModalPresetValues.value = null;
};

const onQuestionModalSave = (data: QuestionInput) => {
    QuestionStore.upsert(data);
};

const onQuestionListEditItem = (questionId: string) => {
    questionModalPresetValues.value = QuestionStore.getByID(questionId) ?? null;
};
</script>

<template>
    <div class="drawer lg:drawer-open">
        <input type="checkbox" class="drawer-toggle" id="main-drawer" />
        <div class="drawer-content grid">
            <div class="tools flex flex-row border-b-2 border-base-300 p-2 gap-2">
                <label for="main-drawer" class="btn btn-sm btn-square drawer-button lg:hidden">
                    <Icon name="md-menu"></Icon>
                </label>
                <label for="questionModal" class="btn btn-sm modal-button flex gap-1 pl-2">
                    <Icon name="md-add"></Icon>
                    {{ $t("question") }}
                </label>
            </div>
            <main class="p-2">
                <MainTable />
            </main>
            <div
                class="questions flex flex-col sm:border-l-2 max-sm:border-t-2 border-base-300 overflow-auto"
            >
                <div
                    class="flex flex-row justify-between items-center sticky p-2 top-0 left-0 bg-base-100"
                >
                    <h1>{{ $t("questions") }}</h1>
                </div>
                <QuestionList label="questionModal" @edit-item="onQuestionListEditItem" />
                <QuestionModal
                    :open="questionModalOpen"
                    label="questionModal"
                    @save="onQuestionModalSave"
                    @close="onQuestionModalClose"
                    :preset-values="questionModalPresetValues"
                />
            </div>
        </div>
        <div class="drawer-side w-full">
            <label for="main-drawer" class="drawer-overlay"></label>
            <div class="grid w-full h-full bg-base-100 lg:w-96">
                <div class="tools flex flex-row border-b-2 border-base-300 p-2 gap-2">
                    <Toolbar />
                    <div class="flex-grow"></div>
                    <label for="main-drawer" class="drawer-button btn btn-sm btn-square lg:hidden">
                        <Icon name="md-close"></Icon>
                    </label>
                </div>
                <PlayerSection />
                <CardSection />
            </div>
        </div>
    </div>
</template>
<style>
.drawer-content {
    grid-template-columns: 4fr 4fr;
    grid-template-rows: min-content 7fr;
    grid-template-areas:
        "tools tools"
        "main questions";
}

@media (max-width: 768px) {
    .drawer-content {
        height: 100dvh;
        grid-template-columns: 1fr;
        grid-template-rows: min-content 4fr 3fr;
        grid-template-areas: "tools" "main" "questions";
    }
}

.drawer-side .grid {
    grid-template-columns: 1fr;
    grid-template-rows: min-content 3fr 4fr;
    grid-template-areas: "tools" "players" "cards";
}

.players {
    grid-area: players;
}

.cards {
    grid-area: cards;
}

.questions {
    grid-area: questions;
}

main {
    grid-area: main;
}

.tools {
    grid-area: tools;
}
</style>
