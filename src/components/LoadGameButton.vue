<template>
    <span
        class="tooltip tooltip-right tooltip-warning hover:z-50"
        :data-tip="$t('load_game_tooltip')"
    >
        <label for="saveDataInput" class="btn btn-sm btn-square text-warning hover:btn-warning">
            <div class="i-tabler-file-import"></div>
        </label>
    </span>
    <teleport to="body">
        <input
            class="hidden"
            type="file"
            name="saveDataInput"
            id="saveDataInput"
            @change="loadSaveData"
        />
    </teleport>
</template>
<script setup lang="ts">
import useCards from "../store/cardStore";
import useGameDataStore from "../store/gameDataStore";
import usePlayerCardRelations from "../store/playerCardRelationStore";
import usePlayers from "../store/playerStore";
import useQuestions from "../store/questionStore";

const CardStore = useCards();
const PlayerStore = usePlayers();
const QuestionStore = useQuestions();
const PlayerCardRelationStore = usePlayerCardRelations();
const GameDataStore = useGameDataStore();

const loadSaveData = (event: Event) => {
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.value.length) return;
    if (eventTarget.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const raw = e.target?.result as string;
            const parsed = GameDataStore.deserialize(raw);
            if (parsed != null) {
                const data = parsed.data;
                PlayerStore.players = data.players;
                CardStore.cards = data.cards;
                QuestionStore.questions = data.questions;
                PlayerCardRelationStore.playerCardRelations = data.playerCardRelations;
            } else {
                // TODO: Show error
            }
        };
        reader.readAsText(eventTarget.files[0]);
    }
};
</script>
