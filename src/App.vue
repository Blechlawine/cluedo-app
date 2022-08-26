<script setup lang="ts">
import PlayerList from "./components/PlayerList.vue";
import PlayerModal from "./components/PlayerModal.vue";
import CardList from "./components/CardList.vue";
import CardModal from "./components/CardModal.vue";
import useCards from "./store/cardStore";
import usePlayers from "./store/playerStore";
import { CardValidator, PlayerValidator } from "./types/validators";
import { ref } from "vue";
import { z } from "zod";

const CardStore = useCards();
const PlayerStore = usePlayers();

const playerModalOpen = ref(false);
const cardModalOpen = ref(false);

const onCardModalSave = (data: z.input<typeof CardValidator>) => {
    CardStore.upsert(data);
};

const onPlayerModalSave = (data: z.input<typeof PlayerValidator>) => {
    PlayerStore.upsert(data);
};
</script>

<template>
    <div class="app grid h-full w-full">
        <div class="players flex flex-col p-2 gap-2 border-r-2 border-b-2 border-base-300">
            <div class="flex flex-row justify-between items-center">
                <h1>Players</h1>
                <label for="playerModal" class="btn btn-sm modal-button">New Player</label>
            </div>
            <PlayerModal :open="playerModalOpen" label="playerModal" @save="onPlayerModalSave"></PlayerModal>
            <PlayerList></PlayerList>
        </div>
        <div class="cards flex flex-col p-2 gap-2 border-r-2 border-base-300">
            <div class="flex flex-row justify-between items-center">
                <h1>Cards</h1>
                <label for="cardModal" class="btn btn-sm modal-button">New Card</label>
            </div>
            <CardModal :open="cardModalOpen" label="cardModal" @save="onCardModalSave"></CardModal>
            <CardList></CardList>
        </div>
        <div class=""></div>
    </div>
</template>
<style>
.app {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
}

.players {
    grid-row: span 2;
    grid-column: 1;
}

.cards {
    grid-row: span 2;
    grid-column: 1;
}
</style>
