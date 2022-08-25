<template>
    <table class="table table-compact w-full">
        <thead>
            <tr>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="card in CardStore.cards" class="hover" :key="card.id">
                <td>{{ card.name }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script setup lang="ts">
import useCards from "../store/cardStore";

const CardStore = useCards();
</script>
