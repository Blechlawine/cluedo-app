<script setup lang="ts">
import PlayerSection from "../components/PlayerSection.vue";
import CardSection from "../components/CardSection.vue";
import QuestionList from "../components/QuestionList.vue";
import QuestionModal from "../components/QuestionModal.vue";
import useCards from "../store/cardStore";
import usePlayers from "../store/playerStore";
import usePlayerCardRelations from "../store/playerCardRelationStore";
import { QuestionInput, QuestionOutput, SaveDataValidator } from "../types/validators";
import { computed, ref } from "vue";
import useQuestions from "../store/questionStore";
import useLanguages from "../store/languageStore";

const CardStore = useCards();
const PlayerStore = usePlayers();
const QuestionStore = useQuestions();
const PlayerCardRelationStore = usePlayerCardRelations();
const LanguageStore = useLanguages();

const questionModalOpen = ref(false);
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

const onQuestionModalClose = () => {
    questionModalPresetValues.value = null;
};

const onQuestionModalSave = (data: QuestionInput) => {
    QuestionStore.upsert(data);
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
    <div class="drawer drawer-mobile">
        <input type="checkbox" class="drawer-toggle" id="main-drawer" />
        <input type="checkbox" class="drawer-toggle" id="question-drawer" />
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
                <table class="table table-compact w-full table-fixed">
                    <thead>
                        <tr>
                            <th>{{ $t("cards") }} ({{ CardStore.cards.length }})</th>
                            <th
                                :class="` text-ellipsis overflow-hidden whitespace-nowrap`"
                                v-for="player in PlayerStore.players"
                                :key="player.id"
                            >
                                {{ player.name }} ({{ player.cardAmount }})
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
                                    <div
                                        class="absolute top-0 left-0 w-full flex flex-row justify-start"
                                    >
                                        <template
                                            v-for="(question, index) in QuestionStore.questions"
                                            :key="question.id"
                                        >
                                            <span
                                                class="text-xs tooltip tooltip-error hover:z-50"
                                                :data-tip="
                                                    $t('does-not-have-this-card-with-question', {
                                                        player: player.name,
                                                        questionNumber: index + 1,
                                                    })
                                                "
                                                v-if="
                                                    question.playersThatDidntHaveAnythingIds.includes(
                                                        player.id
                                                    ) &&
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
                                            class="btn btn-sm btn-square hover:btn-success btn-ghost tooltip hover:z-50 normal-case"
                                            :data-tip="$t('has-this-card')"
                                            @click="
                                                () =>
                                                    upsertPlayerCardRelation(
                                                        player.id,
                                                        card.id,
                                                        true
                                                    )
                                            "
                                        >
                                            <Icon name="md-check"></Icon>
                                        </button>
                                        <button
                                            class="btn btn-sm btn-square hover:btn-error btn-ghost tooltip hover:z-50 normal-case"
                                            :data-tip="$t('does-not-have-this-card')"
                                            @click="
                                                () =>
                                                    upsertPlayerCardRelation(
                                                        player.id,
                                                        card.id,
                                                        false
                                                    )
                                            "
                                        >
                                            <Icon name="md-close"></Icon>
                                        </button>
                                    </div>
                                    <div
                                        class="absolute bottom-0 right-0 w-full flex flex-row justify-end"
                                    >
                                        <template
                                            v-for="(question, index) in QuestionStore.questions"
                                            :key="question.id"
                                        >
                                            <span
                                                class="tooltip tooltip-success text-xs hover:z-20"
                                                :data-tip="
                                                    $t('showed-this-card-to', {
                                                        player: player.name,
                                                        otherPlayer: PlayerStore.players.find(
                                                            (p) => p.id == question.askingPlayerId
                                                        )?.name,
                                                        questionNumber: index + 1,
                                                    })
                                                "
                                                v-if="
                                                    question.answeringPlayerId === player.id &&
                                                    (question.suspectCardId === card.id ||
                                                        question.weaponCardId === card.id ||
                                                        question.locationCardId === card.id)
                                                "
                                            >
                                                {{
                                                    PlayerStore.players
                                                        .find(
                                                            (p) => p.id == question.askingPlayerId
                                                        )
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
                <div
                    class="flex flex-row justify-between items-center sticky p-2 top-0 left-0 z-20 bg-base-100"
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
                    <span
                        class="tooltip tooltip-right tooltip-error hover:z-50"
                        :data-tip="$t('new_game_tooltip')"
                    >
                        <label
                            class="btn btn-sm btn-square text-error hover:btn-error"
                            for="newGameModal"
                        >
                            <Icon name="md-noteadd"></Icon>
                        </label>
                    </span>
                    <span
                        class="tooltip tooltip-right tooltip-success hover:z-50"
                        :data-tip="$t('save_game_tooltip')"
                    >
                        <a
                            :href="`data:text/json;charset=utf-8,${saveData}`"
                            download="saveData.json"
                            class="btn btn-sm btn-square text-success hover:btn-success"
                        >
                            <Icon name="md-save"></Icon>
                        </a>
                    </span>
                    <span
                        class="tooltip tooltip-right tooltip-warning hover:z-50"
                        :data-tip="$t('load_game_tooltip')"
                    >
                        <label
                            for="saveDataInput"
                            class="btn btn-sm btn-square text-warning hover:btn-warning"
                        >
                            <Icon name="md-fileopen"></Icon>
                        </label>
                    </span>
                    <div class="dropdown">
                        <label tabindex="0" class="btn btn-sm">{{ $t("language") }}</label>
                        <ul
                            tabindex="0"
                            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li><a @click="LanguageStore.locale = 'en'">English</a></li>
                            <li><a @click="LanguageStore.locale = 'de'">Deutsch</a></li>
                        </ul>
                    </div>
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
    <teleport to="body">
        <input type="checkbox" id="newGameModal" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box relative">
                <label for="newGameModal" class="btn btn-sm btn-circle absolute right-2 top-2">
                    <Icon name="md-close"></Icon>
                </label>
                <h3 class="text-lg font-bold">{{ $t("start-new-game") }}</h3>
                <p>{{ $t("warning-delete-everything") }}</p>
                <div class="modal-action">
                    <label for="newGameModal" class="btn btn-sm btn-ghost">
                        {{ $t("cancel") }}
                    </label>
                    <label for="newGameModal" class="btn btn-sm btn-primary" @click="startNewGame">
                        {{ $t("continue") }}
                    </label>
                </div>
            </div>
        </div>
        <input
            class="hidden"
            type="file"
            name="saveDataInput"
            id="saveDataInput"
            @change="loadSaveData"
        />
    </teleport>
</template>
<style>
.drawer-content {
    grid-template-columns: 4fr 4fr;
    grid-template-rows: min-content 7fr;
    grid-template-areas:
        "tools tools"
        "main questions";
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