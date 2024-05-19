<template>
    <td class="w-max">
        {{ timestamp.format("YYYY.MM.DD") }} <br />
        {{ timestamp.format("HH:mm") }}
    </td>
    <td class="whitespace-nowrap text-ellipsis overflow-hidden">{{ askingPlayer?.name }}</td>
    <td class="whitespace-nowrap text-ellipsis overflow-hidden">{{ answeringPlayer?.name }}</td>
    <td class="w-min">
        {{ $t("suspect") }}: <b>{{ suspectCard?.name }}</b> <br />
        {{ $t("weapon") }}: <b>{{ weaponCard?.name }}</b> <br />
        {{ $t("location") }}: <b>{{ locationCard?.name }}</b>
    </td>
</template>
<script setup lang="ts">
import day from "dayjs";
import { type PropType, computed } from "vue";
import useCards from "../store/cardStore";
import usePlayers from "../store/playerStore";
import type { QuestionOutput } from "../types/validators";

const PlayerStore = usePlayers();
const CardStore = useCards();

const props = defineProps({
    question: {
        type: Object as PropType<QuestionOutput>,
        required: true,
    },
});

const askingPlayer = computed(() =>
    PlayerStore.players.find((p) => p.id === props.question.askingPlayerId),
);
const answeringPlayer = computed(() =>
    PlayerStore.players.find((p) => p.id === props.question.answeringPlayerId),
);
const timestamp = computed(() => day(props.question.timestamp));

const suspectCard = computed(() =>
    CardStore.cards.find((c) => c.id === props.question.suspectCardId),
);
const weaponCard = computed(() =>
    CardStore.cards.find((c) => c.id === props.question.weaponCardId),
);
const locationCard = computed(() =>
    CardStore.cards.find((c) => c.id === props.question.locationCardId),
);
</script>
