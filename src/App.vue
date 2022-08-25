<script setup lang="ts">
import PlayerList from "./components/PlayerList.vue";
import PlayerModal from "./components/PlayerModal.vue";
import CardList from "./components/CardList.vue";
import CardModal from "./components/CardModal.vue";
import { ref } from "vue";

const playerModalOpen = ref(false);
const cardModalOpen = ref(false);
</script>

<template>
    <div class="grid">
        <div class="flex">
            <h1>Players</h1>
            <label for="playerModal" class="btn btn-sm modal-button">New Player</label>
            <PlayerModal :open="playerModalOpen" label="playerModal"></PlayerModal>
            <PlayerList></PlayerList>
        </div>
        <div class="flex">
            <h1>Cards</h1>
            <label for="cardModal" class="btn btn-sm modal-button">New Card</label>
            <CardModal :open="cardModalOpen" label="cardModal"></CardModal>
            <CardList></CardList>
        </div>
        <div class="flex">
            
        </div>
    </div>
</template>
