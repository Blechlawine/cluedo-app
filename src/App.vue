<script setup lang="ts">
import PlayerList from "./components/PlayerList.vue";
import PlayerModal from "./components/PlayerModal.vue";
import CardList from "./components/CardList.vue";
import CardModal from "./components/CardModal.vue";
import QuestionList from "./components/QuestionList.vue";
import QuestionModal from "./components/QuestionModal.vue";
import useCards from "./store/cardStore";
import usePlayers from "./store/playerStore";
import usePlayerCardRelations from "./store/playerCardRelationStore";
import {
    CardInput,
    CardOutput,
    PlayerInput,
    PlayerOutput,
    QuestionInput,
    QuestionOutput,
    SaveDataValidator,
} from "./types/validators";
import { computed, ref } from "vue";
import useQuestions from "./store/questionStore";

const CardStore = useCards();
const PlayerStore = usePlayers();
const QuestionStore = useQuestions();
const PlayerCardRelationStore = usePlayerCardRelations();

const playerModalOpen = ref(false);
const cardModalOpen = ref(false);
const questionModalOpen = ref(false);
const cardModalPresetValues = ref<CardOutput | null>(null);
const playerModalPresetValues = ref<PlayerOutput | null>(null);
const questionModalPresetValues = ref<QuestionOutput | null>(null);

const saveData = computed(() =>
    encodeURIComponent(
        JSON.stringify({
            cards: CardStore.cards,
            players: PlayerStore.players,
            questions: QuestionStore.questions,
            playerCardRelations: PlayerCardRelationStore.playerCardRelations,
        })
    )
);

const onCardModalClose = () => {
    cardModalPresetValues.value = null;
};

const onPlayerModalClose = () => {
    playerModalPresetValues.value = null;
};

const onQuestionModalClose = () => {
    questionModalPresetValues.value = null;
};

const onCardModalSave = (data: CardInput) => {
    CardStore.upsert(data);
};

const onPlayerModalSave = (data: PlayerInput) => {
    PlayerStore.upsert(data);
};

const onQuestionModalSave = (data: QuestionInput) => {
    QuestionStore.upsert(data);
};

const onCardListEditItem = (cardId: string) => {
    cardModalPresetValues.value = CardStore.getByID(cardId) ?? null;
};

const onPlayerListEditItem = (playerId: string) => {
    playerModalPresetValues.value = PlayerStore.getByID(playerId) ?? null;
};

const onQuestionListEditItem = (questionId: string) => {
    questionModalPresetValues.value = QuestionStore.getByID(questionId) ?? null;
};

const startNewGame = () => {
    PlayerStore.players = [];
    CardStore.cards = [];
    QuestionStore.questions = [];
    PlayerCardRelationStore.playerCardRelations = [];
};

const loadSaveData = (event: Event) => {
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.value.length) return;
    else if (eventTarget.files) {
        let reader = new FileReader();
        reader.onload = (e) => {
            const raw = e.target?.result as string;
            const parsed = SaveDataValidator.safeParse(JSON.parse(raw));
            if (parsed.success) {
                const data = parsed.data;
                PlayerStore.players = data.players;
                CardStore.cards = data.cards;
                QuestionStore.questions = data.questions;
                PlayerCardRelationStore.playerCardRelations = data.playerCardRelations;
            } else {
                // TODO: show alert "Error parsing save"
            }
        };
        reader.readAsText(eventTarget.files[0]);
    }
};

const getTdClasses = (playerId: string, cardId: string) => {
    const relation = PlayerCardRelationStore.getByPlayerIdAndCardId(playerId, cardId);
    if (relation && relation.value) {
        return "bg-success text-success-content";
    } else if (relation && !relation.value) {
        return "bg-error text-error-content";
    } else {
        return "bg-warning text-warning-content";
    }
};

const upsertPlayerCardRelation = (playerId: string, cardId: string, value: boolean) => {
    PlayerCardRelationStore.upsert({
        playerId,
        cardId,
        value,
    });
};
</script>

<template>
    <div class="app grid h-full w-full">
        <div class="tools flex flex-row border-b-2 border-base-300 p-2 gap-2">
            <label class="btn btn-sm btn-square text-error hover:btn-error" for="newGameModal">
                <Icon name="md-noteadd"></Icon>
            </label>
            <a
                :href="`data:text/json;charset=utf-8,${saveData}`"
                download="saveData.json"
                class="btn btn-sm btn-square text-success hover:btn-success"
            >
                <Icon name="md-save"></Icon>
            </a>
            <label for="saveDataInput" class="btn btn-sm btn-square text-warning hover:btn-warning">
                <Icon name="md-fileopen"></Icon>
            </label>
            <div class="divider divider-horizontal"></div>
            <label for="questionModal" class="btn btn-sm modal-button flex gap-1 pl-2">
                <Icon name="md-add"></Icon>
                Question
            </label>
        </div>
        <div class="players flex flex-col border-r-2 border-b-2 border-base-300 overflow-auto">
            <div class="flex flex-row justify-between items-center sticky p-2 top-0 left-0 z-20 bg-base-100">
                <h1>Players</h1>
                <label for="playerModal" class="btn btn-sm modal-button flex gap-1 pl-2">
                    <Icon name="md-add"></Icon>
                    Player
                </label>
            </div>
            <PlayerModal
                :open="playerModalOpen"
                label="playerModal"
                @save="onPlayerModalSave"
                @close="onPlayerModalClose"
                :preset-values="playerModalPresetValues"
            ></PlayerModal>
            <PlayerList label="playerModal" @edit-item="onPlayerListEditItem"></PlayerList>
        </div>
        <div class="cards flex flex-col border-r-2 border-base-300 overflow-auto">
            <div class="flex flex-row justify-between items-center sticky p-2 top-0 left-0 z-20 bg-base-100">
                <h1>Cards</h1>
                <label for="cardModal" class="btn btn-sm modal-button flex gap-1 pl-2">
                    <Icon name="md-add"></Icon>
                    Card
                </label>
            </div>
            <CardModal
                :open="cardModalOpen"
                label="cardModal"
                @save="onCardModalSave"
                @close="onCardModalClose"
                :preset-values="cardModalPresetValues"
            ></CardModal>
            <CardList label="cardModal" @edit-item="onCardListEditItem"></CardList>
        </div>
        <main class="p-2">
            <table class="table table-compact w-full table-fixed">
                <thead>
                    <tr>
                        <th>Cards</th>
                        <th
                            :class="` text-ellipsis overflow-hidden whitespace-nowrap`"
                            v-for="player in PlayerStore.players"
                            :key="player.id"
                        >
                            {{ player.name }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="card in CardStore.cards" :key="card.id">
                        <td>
                            {{ card.name }}
                        </td>
                        <td
                            v-for="player in PlayerStore.players"
                            :key="player.id"
                            :class="getTdClasses(player.id, card.id)"
                            class="text-center relative"
                        >
                            <div class="flex flex-col">
                                <div class="absolute top-0 left-0 w-full flex flex-row justify-start">
                                    <template v-for="(question, index) in QuestionStore.questions" :key="question.id">
                                        <span
                                            class="text-xs tooltip"
                                            :data-tip="`Didn't have this card in Question ${index + 1}`"
                                            v-if="
                                                question.playersThatDidntHaveAnythingIds.includes(player.id) &&
                                                (question.suspectCardId === card.id ||
                                                    question.weaponCardId === card.id ||
                                                    question.locationCardId === card.id)
                                            "
                                        >
                                            {{ `Q${index + 1}` }}
                                        </span>
                                    </template>
                                </div>
                                <div>
                                    <button
                                        class="btn btn-sm btn-square hover:btn-success btn-ghost"
                                        @click="() => upsertPlayerCardRelation(player.id, card.id, true)"
                                    >
                                        <Icon name="md-check"></Icon>
                                    </button>
                                    <button
                                        class="btn btn-sm btn-square hover:btn-error btn-ghost"
                                        @click="() => upsertPlayerCardRelation(player.id, card.id, false)"
                                    >
                                        <Icon name="md-close"></Icon>
                                    </button>
                                </div>
                                <div class="absolute bottom-0 right-0 w-full flex flex-row justify-end">
                                    <template v-for="(question, index) in QuestionStore.questions" :key="question.id">
                                        <span
                                            class="tooltip text-xs hover:z-20"
                                            :data-tip="`Showed this card to ${PlayerStore.players.find(
                                                (p) => p.id == question.askingPlayerId
                                            )?.name} in question ${index + 1}`"
                                            v-if="
                                                question.answeringPlayerId === player.id &&
                                                (question.suspectCardId === card.id ||
                                                    question.weaponCardId === card.id ||
                                                    question.locationCardId === card.id)
                                            "
                                        >
                                            {{
                                                PlayerStore.players
                                                    .find((p) => p.id == question.askingPlayerId)
                                                    ?.name.substring(0, 1)
                                            }}
                                        </span>
                                    </template>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </main>
        <div class="questions flex flex-col border-l-2 border-base-300 overflow-auto">
            <div class="flex flex-row justify-between items-center sticky p-2 top-0 left-0 z-20 bg-base-100">
                <h1>Questions</h1>
            </div>
            <QuestionList label="questionModal" @edit-item="onQuestionListEditItem"></QuestionList>
            <QuestionModal
                :open="questionModalOpen"
                label="questionModal"
                @save="onQuestionModalSave"
                @close="onQuestionModalClose"
                :preset-values="questionModalPresetValues"
            ></QuestionModal>
        </div>
        <teleport to="body">
            <input type="checkbox" id="newGameModal" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box relative">
                    <label for="newGameModal" class="btn btn-sm btn-circle absolute right-2 top-2">
                        <Icon name="md-close"></Icon>
                    </label>
                    <h3 class="text-lg font-bold">Start new game</h3>
                    <p>This will delete everything not saved! Are you sure you want to continue?</p>
                    <div class="modal-action">
                        <label for="newGameModal" class="btn btn-sm btn-ghost">Cancel</label>
                        <label for="newGameModal" class="btn btn-sm btn-primary" @click="startNewGame">Continue</label>
                    </div>
                </div>
            </div>
            <input class="hidden" type="file" name="saveDataInput" id="saveDataInput" @change="loadSaveData" />
        </teleport>
    </div>
</template>
<style>
.app {
    grid-template-columns: 2fr 4fr 4fr;
    grid-template-rows: min-content 3fr 4fr;
    grid-template-areas:
        "tools tools tools"
        "players main questions"
        "cards main questions";
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
