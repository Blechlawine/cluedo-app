<script setup lang="ts">
import useGame from "./store/gameStore";
import PlayerList from "./components/PlayerList.vue";
import PlayerModal from "./components/PlayerModal.vue";
import { ref } from "vue";

const GameStore = useGame();

const playerModalOpen = ref(false);
</script>

<template>
    <div class="grid">
        <div class="flex">
            <label for="playerModal" class="btn btn-sm modal-button">New Player</label>
            <PlayerModal :open="playerModalOpen" label="playerModal"></PlayerModal>
            <PlayerList></PlayerList>
        </div>
    </div>
</template>
