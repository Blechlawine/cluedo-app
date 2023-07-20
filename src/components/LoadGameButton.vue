<template>
    <span
        class="tooltip tooltip-right tooltip-warning hover:z-50"
        :data-tip="$t('load_game_tooltip')"
    >
        <label for="saveDataInput" class="btn btn-sm btn-square text-warning hover:btn-warning">
            <Icon name="md-fileopen"></Icon>
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
import usePlayerCardRelations from "../store/playerCardRelationStore";
import usePlayers from "../store/playerStore";
import useQuestions from "../store/questionStore";
import { SaveDataValidator } from "../types/validators";

const CardStore = useCards();
const PlayerStore = usePlayers();
const QuestionStore = useQuestions();
const PlayerCardRelationStore = usePlayerCardRelations();

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
</script>
