<template>
    <div class="players flex flex-col border-r-2 border-b-2 border-base-300 overflow-auto">
        <div
            class="flex flex-row justify-between items-center sticky p-2 top-0 left-0 z-10 bg-base-100"
        >
            <h1>{{ $t("players") }}</h1>
            <label for="playerModal" class="btn btn-sm modal-button flex gap-1 pl-2">
                <Icon name="md-add"></Icon>
                {{ $t("player") }}
            </label>
        </div>
        <PlayerModal
            :open="playerModalOpen"
            label="playerModal"
            @save="onPlayerModalSave"
            @close="onPlayerModalClose"
            :preset-values="playerModalPresetValues"
        />
        <PlayerList label="playerModal" @edit-item="onPlayerListEditItem" />
    </div>
</template>
<script setup lang="ts">
import PlayerList from "./PlayerList.vue";
import PlayerModal from "./PlayerModal.vue";
import { ref } from "vue";
import usePlayers from "../store/playerStore";
import type { PlayerInput, PlayerOutput } from "../types/validators";

const PlayerStore = usePlayers();

const playerModalOpen = ref(false);
const playerModalPresetValues = ref<PlayerOutput | null>(null);

const onPlayerModalClose = () => {
    playerModalPresetValues.value = null;
};

const onPlayerModalSave = (data: PlayerInput) => {
    PlayerStore.upsert(data);
};

const onPlayerListEditItem = (playerId: string) => {
    playerModalPresetValues.value = PlayerStore.getByID(playerId) ?? null;
};
</script>
