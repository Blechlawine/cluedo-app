<script setup lang="ts">
import PlayerList from "./components/PlayerList.vue";
import PlayerModal from "./components/PlayerModal.vue";
import CardList from "./components/CardList.vue";
import CardModal from "./components/CardModal.vue";
import useCards from "./store/cardStore";
import usePlayers from "./store/playerStore";
import usePlayerCardRelations from "./store/playerCardRelationStore";
import { CardInput, CardOutput, PlayerInput, PlayerOutput } from "./types/validators";
import { computed, ref } from "vue";

const CardStore = useCards();
const PlayerStore = usePlayers();
const PlayerCardRelationStore = usePlayerCardRelations();

const playerModalOpen = ref(false);
const cardModalOpen = ref(false);
const cardModalPresetValues = ref<CardOutput | null>(null);
const playerModalPresetValues = ref<PlayerOutput | null>(null);

const saveData = computed(() =>
    encodeURIComponent(
        JSON.stringify({
            cards: CardStore.cards,
            players: PlayerStore.players,
        })
    )
);

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

const startNewGame = () => {
    PlayerStore.players = [];
    CardStore.cards = [];
};

const loadSaveData = (event: Event) => {
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.value.length) return;
    else if (eventTarget.files) {
        let reader = new FileReader();
        reader.onload = (e) => {
            const raw = e.target?.result as string;
            const data = JSON.parse(raw); //TODO: type this
            PlayerStore.players = data.players;
            CardStore.cards = data.cards;
        };
        reader.readAsText(eventTarget.files[0]);
    }
};

const getTdClasses = (playerId: string, cardId: string) => {
    const relation = PlayerCardRelationStore.getByPlayerIdAndCardId(playerId, cardId);
    if (relation && relation.value) {
        return "bg-success text-success-content";
    } else {
        return "bg-error text-error-content";
    }
};

const upsertRelation = (playerId: string, cardId: string, value: boolean) => {
    console.log("upsertRelation", playerId, cardId, value);
    PlayerCardRelationStore.upsert({
        playerId,
        cardId,
        value,
    });
};
</script>

<template>
    <div class="app grid h-full w-full">
        <div class="tools flex flex-row border-b-2 border-base-300 p-2 gap-2">
            <label class="btn btn-sm btn-square text-error hover:btn-error" for="newGameModal">
                <Icon name="md-noteadd"></Icon>
            </label>
            <a
                :href="`data:text/json;charset=utf-8,${saveData}`"
                download="saveData.json"
                class="btn btn-sm btn-square text-success hover:btn-success"
            >
                <Icon name="md-save"></Icon>
            </a>
            <label for="saveDataInput" class="btn btn-sm btn-square text-warning hover:btn-warning">
                <Icon name="md-fileopen"></Icon>
            </label>
            <div class="divider divider-horizontal"></div>
            <button class="btn btn-sm">Question</button>
        </div>
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
            <table class="table table-compact">
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
                        <td
                            v-for="player in PlayerStore.players"
                            :key="player.id"
                            :class="getTdClasses(player.id, card.id)"
                            class="flex flex-row items-center justify-center"
                        >
                            <button
                                class="btn btn-sm btn-square hover:btn-success btn-ghost"
                                @click="() => upsertRelation(player.id, card.id, true)"
                            >
                                <Icon name="md-check"></Icon>
                            </button>
                            <button
                                class="btn btn-sm btn-square hover:btn-error btn-ghost"
                                @click="() => upsertRelation(player.id, card.id, false)"
                            >
                                <Icon name="md-close"></Icon>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </main>
        <teleport to="body">
            <input type="checkbox" id="newGameModal" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box relative">
                    <label for="newGameModal" class="btn btn-sm btn-circle absolute right-2 top-2">
                        <Icon name="md-close"></Icon>
                    </label>
                    <h3 class="text-lg font-bold">Start new game</h3>
                    <p>This will delete everything not saved! Are you sure you want to continue?</p>
                    <div class="modal-action">
                        <label for="newGameModal" class="btn btn-sm btn-ghost">Cancel</label>
                        <label for="newGameModal" class="btn btn-sm btn-primary" @click="startNewGame">Continue</label>
                    </div>
                </div>
            </div>
            <input class="hidden" type="file" name="saveDataInput" id="saveDataInput" @change="loadSaveData" />
        </teleport>
    </div>
</template>
<style>
.app {
    grid-template-columns: 1fr 3fr;
    grid-template-rows: min-content 3fr 4fr;
    grid-template-areas:
        "tools tools"
        "players main"
        "cards main";
}

.players {
    grid-area: players;
}

.cards {
    grid-area: cards;
}

main {
    grid-area: main;
}

.tools {
    grid-area: tools;
}
</style>
