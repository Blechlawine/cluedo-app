<script setup lang="ts">
import PlayerList from "./components/PlayerList.vue";
import PlayerModal from "./components/PlayerModal.vue";
import CardList from "./components/CardList.vue";
import CardModal from "./components/CardModal.vue";
import useCards from "./store/cardStore";
import usePlayers from "./store/playerStore";
import { CardInput, CardOutput, PlayerInput, PlayerOutput } from "./types/validators";
import { ref } from "vue";

const CardStore = useCards();
const PlayerStore = usePlayers();

const playerModalOpen = ref(false);
const cardModalOpen = ref(false);
const cardModalPresetValues = ref<CardOutput | null>(null);
const playerModalPresetValues = ref<PlayerOutput | null>(null);

const onCardModalClose = () => {
    cardModalPresetValues.value = null;
};

const onPlayerModalClose = () => {
    playerModalPresetValues.value = null;
};

const onCardModalSave = (data: CardInput) => {
    CardStore.upsert(data);
};

const onPlayerModalSave = (data: PlayerInput) => {
    PlayerStore.upsert(data);
};

const onCardListEditItem = (cardId: string) => {
    cardModalPresetValues.value = CardStore.getByID(cardId) ?? null;
};

const onPlayerListEditItem = (playerId: string) => {
    playerModalPresetValues.value = PlayerStore.getByID(playerId) ?? null;
};
</script>

<template>
    <div class="app grid h-full w-full">
        <div class="players flex flex-col p-2 gap-2 border-r-2 border-b-2 border-base-300 overflow-auto">
            <div class="flex flex-row justify-between items-center sticky top-0">
                <h1>Players</h1>
                <label for="playerModal" class="btn btn-sm modal-button">New Player</label>
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
        <div class="cards flex flex-col p-2 gap-2 border-r-2 border-base-300 overflow-auto">
            <div class="flex flex-row justify-between items-center sticky top-0">
                <h1>Cards</h1>
                <label for="cardModal" class="btn btn-sm modal-button">New Card</label>
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
        <main class="">
            <table class="table">
                <thead>
                    <tr>
                        <th>Cards</th>
                        <th v-for="player in PlayerStore.players" :key="player.id">{{ player.name }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="card in CardStore.cards" :key="card.id">
                        <td>
                            {{ card.name }}
                        </td>
                        <td v-for="player in PlayerStore.players" :key="player.id"></td>
                    </tr>
                </tbody>
            </table>
        </main>
    </div>
</template>
<style>
.app {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
}

.players {
    grid-row: 1/3;
    grid-column: 1;
}

.cards {
    grid-row: 3/5;
    grid-column: 1;
}

main {
    grid-row: 1/5;
    grid-column: 2/5;
}
</style>
