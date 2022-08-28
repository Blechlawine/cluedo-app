<template>
    <td>{{ question.timestamp }}</td>
    <td>{{ askingPlayer?.name }}</td>
    <td>{{ answeringPlayer?.name }}</td>
    <td>{{ suspectCard?.name }}</td>
    <td>{{ weaponCard?.name }}</td>
    <td>{{ locationCard?.name }}</td>
</template>
<script setup lang="ts">
import { computed, PropType } from "vue";
import useCards from "../store/cardStore";
import usePlayers from "../store/playerStore";
import { QuestionOutput } from "../types/validators";

const PlayerStore = usePlayers();
const CardStore = useCards();

const props = defineProps({
    question: {
        type: Object as PropType<QuestionOutput>,
        required: true,
    },
});

const askingPlayer = computed(() => PlayerStore.players.find((p) => p.id === props.question.askingPlayerId));
const answeringPlayer = computed(() => PlayerStore.players.find((p) => p.id === props.question.answeringPlayerId));

const suspectCard = computed(() => CardStore.cards.find((c) => c.id === props.question.suspectCardId));
const weaponCard = computed(() => CardStore.cards.find((c) => c.id === props.question.weaponCardId));
const locationCard = computed(() => CardStore.cards.find((c) => c.id === props.question.locationCardId));
</script>
