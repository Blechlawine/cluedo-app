<template>
    <teleport to="body">
        <input type="checkbox" :checked="props.open" :id="props.label" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box relative">
                <label :for="props.label" class="btn btn-sm btn-circle absolute right-2 top-2" @click="closeBtnClick">
                    <Icon name="md-close"></Icon>
                </label>
                <h3 class="text-lg font-bold">{{ props.title }}</h3>
                <div class="content">
                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Asking player</span>
                        </label>
                        <select class="select select-bordered" v-model="askingPlayerId">
                            <option disabled selected :value="null">Pick one</option>
                            <option v-for="player in PlayerStore.players" :key="player.id" :value="player.id">
                                {{ player.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Answering player</span>
                        </label>
                        <select class="select select-bordered" v-model="answeringPlayerId">
                            <option disabled selected :value="null">Pick one</option>
                            <option v-for="player in PlayerStore.players" :key="player.id" :value="player.id">
                                {{ player.name }}
                            </option>
                        </select>
                    </div>
                    <h4>Cards</h4>
                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Suspect card</span>
                        </label>
                        <select class="select select-bordered" v-model="suspectCardId">
                            <option disabled selected :value="null">Pick one</option>
                            <option v-for="card in CardStore.suspects" :key="card.id" :value="card.id">
                                {{ card.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Weapon card</span>
                        </label>
                        <select class="select select-bordered" v-model="weaponCardId">
                            <option disabled selected :value="null">Pick one</option>
                            <option v-for="card in CardStore.weapons" :key="card.id" :value="card.id">
                                {{ card.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Location card</span>
                        </label>
                        <select class="select select-bordered" v-model="locationCardId">
                            <option disabled selected :value="null">Pick one</option>
                            <option v-for="card in CardStore.locations" :key="card.id" :value="card.id">
                                {{ card.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="modal-action">
                    <label :for="props.label" class="btn btn-sm btn-ghost" @click="closeBtnClick">Cancel</label>
                    <label :for="props.label" class="btn btn-sm btn-primary" @click="saveBtnClick">Save</label>
                </div>
            </div>
        </div>
    </teleport>
</template>
<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import useCards from "../store/cardStore";
import usePlayers from "../store/playerStore";
import { QuestionInput, QuestionOutput } from "../types/validators";

const PlayerStore = usePlayers();
const CardStore = useCards();

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    open: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: "Create new question",
    },
    presetValues: {
        type: Object as PropType<QuestionOutput | null>,
        default: null,
    },
});

watch(
    () => props.presetValues,
    () => {
        if (props.presetValues) {
            askingPlayerId.value = props.presetValues?.askingPlayerId ?? null;
            answeringPlayerId.value = props.presetValues?.answeringPlayerId ?? null;
            suspectCardId.value = props.presetValues?.suspectCardId ?? null;
            weaponCardId.value = props.presetValues?.weaponCardId ?? null;
            locationCardId.value = props.presetValues?.locationCardId ?? null;
        } else {
            askingPlayerId.value = null;
            answeringPlayerId.value = null;
            suspectCardId.value = null;
            weaponCardId.value = null;
            locationCardId.value = null;
        }
    },
    {
        deep: true,
    }
);

const askingPlayerId = ref<string | null>(null);
const answeringPlayerId = ref<string | null>(null);
const suspectCardId = ref<string | null>(null);
const weaponCardId = ref<string | null>(null);
const locationCardId = ref<string | null>(null);

const emit = defineEmits<{
    (e: "close"): void;
    (e: "save", data: QuestionInput): void;
}>();

const closeBtnClick = () => {
    emit("close");
    askingPlayerId.value = null;
    answeringPlayerId.value = null;
    suspectCardId.value = null;
    weaponCardId.value = null;
    locationCardId.value = null;
};

const saveBtnClick = (event: Event) => {
    if (!askingPlayerId.value || !suspectCardId.value || !weaponCardId.value || !locationCardId.value) {
        event.preventDefault();
        // TODO: Show alert
    } else {
        const askingPlayerIndex = PlayerStore.players.findIndex((p) => p.id === askingPlayerId.value);
        const answeringPlayerIndex = PlayerStore.players.findIndex((p) => p.id === answeringPlayerId.value);
        let emptyPlayers = [];
        // Adapted from https://stackoverflow.com/a/61928036
        let end = answeringPlayerIndex;
        let start = askingPlayerIndex + 1;
        if (answeringPlayerIndex < askingPlayerIndex) {
            end += PlayerStore.players.length;
        }
        for (let i = start; i < end; i++) {
            emptyPlayers.push(i % PlayerStore.players.length);
        }
        emptyPlayers = emptyPlayers.map((index) => PlayerStore.players[index].id);
        emit("save", {
            ...props.presetValues,
            askingPlayerId: askingPlayerId.value,
            answeringPlayerId: answeringPlayerId.value ?? null,
            playersThatDidntHaveAnythingIds: emptyPlayers, // TODO
            suspectCardId: suspectCardId.value,
            weaponCardId: weaponCardId.value,
            locationCardId: locationCardId.value,
        });
        emit("close");
    }
};
</script>