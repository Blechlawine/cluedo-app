<template>
    <div class="flex">
        <div class="card" v-for="card in CardStore.cards" :key="card.id">{{ card.name }}</div>
    </div>
</template>
<script setup lang="ts">
import useCards from "../store/cardStore";

const CardStore = useCards();
</script>
