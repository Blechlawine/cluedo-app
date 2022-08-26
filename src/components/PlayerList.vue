<template>
    <table class="table table-compact w-full">
        <thead>
            <tr>
                <th>Name</th>
                <th>Card-amount</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="player in PlayerStore.players" class="hover" :key="player.id">
                <td>{{ player.name }}</td>
                <td>{{ player.cardAmount }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script setup lang="ts">
import usePlayers from "../store/playerStore";

const PlayerStore = usePlayers();
</script>
