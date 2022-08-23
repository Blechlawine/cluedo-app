<template>
    <div class="flex">
        <div class="player" v-for="player in PlayerStore.players" :key="player.id">{{ player.name }}</div>
    </div>
</template>
<script setup lang="ts">
import usePlayers from "../store/playerStore";

const PlayerStore = usePlayers();
</script>
