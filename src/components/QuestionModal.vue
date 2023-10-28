<template>
    <Modal :name="props.label">
        <h3 class="text-lg font-bold">{{ props.title ?? $t("create-new-question") }}</h3>
        <div class="content">
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">{{ $t("asking-player") }}</span>
                </label>
                <select class="select select-bordered" v-model="askingPlayerId">
                    <option disabled selected :value="null">
                        {{ $t("pick-one-player") }}
                    </option>
                    <option v-for="player in PlayerStore.players" :key="player.id" :value="player.id">
                        {{ player.name }}
                    </option>
                </select>
            </div>
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">{{ $t("answering-player") }}</span>
                </label>
                <select class="select select-bordered" v-model="answeringPlayerId">
                    <option disabled selected :value="undefined">
                        {{ $t("pick-one-player") }}
                    </option>
                    <option :value="null">
                        {{ $t("no-player") }}
                    </option>
                    <option v-for="player in PlayerStore.players" :key="player.id" :value="player.id">
                        {{ player.name }}
                    </option>
                </select>
            </div>
            <h4>{{ $t("cards") }}</h4>
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">{{ $t("suspect-card") }}</span>
                </label>
                <select class="select select-bordered" v-model="suspectCardId">
                    <option disabled selected :value="null">
                        {{ $t("pick-one-card") }}
                    </option>
                    <option v-for="card in CardStore.suspects" :key="card.id" :value="card.id">
                        {{ card.name }}
                    </option>
                </select>
            </div>
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">{{ $t("weapon-card") }}</span>
                </label>
                <select class="select select-bordered" v-model="weaponCardId">
                    <option disabled selected :value="null">
                        {{ $t("pick-one-card") }}
                    </option>
                    <option v-for="card in CardStore.weapons" :key="card.id" :value="card.id">
                        {{ card.name }}
                    </option>
                </select>
            </div>
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">{{ $t("location-card") }}</span>
                </label>
                <select class="select select-bordered" v-model="locationCardId">
                    <option disabled selected :value="null">
                        {{ $t("pick-one-card") }}
                    </option>
                    <option v-for="card in CardStore.locations" :key="card.id" :value="card.id">
                        {{ card.name }}
                    </option>
                </select>
            </div>
        </div>
        <template #action>
            <button class="btn btn-sm btn-ghost" @click="closeBtnClick">
                {{ $t("cancel") }}
            </button>
            <button class="btn btn-sm btn-primary" @click="saveBtnClick">
                {{ $t("save") }}
            </button>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import useCards from "../store/cardStore";
import usePlayers from "../store/playerStore";
import { QuestionInput, QuestionOutput } from "../types/validators";
import Modal from "./Modal.vue";

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
const answeringPlayerId = ref<string | null | undefined>(undefined);
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
    if (
        !askingPlayerId.value ||
        !suspectCardId.value ||
        !weaponCardId.value ||
        !locationCardId.value ||
        answeringPlayerId.value === undefined
    ) {
        event.preventDefault();
        // TODO: Show alert
    } else {
        const askingPlayerIndex = PlayerStore.players.findIndex(
            (p) => p.id === askingPlayerId.value
        );
        let emptyPlayers: string[] = [];
        if (answeringPlayerId.value === null) {
            emptyPlayers = PlayerStore.players.filter(p => p.id !== askingPlayerId.value).map(p => p.id);
        } else {
            const answeringPlayerIndex = PlayerStore.players.findIndex(
                (p) => p.id === answeringPlayerId.value
            );
            let tempEmptyPlayers: number[] = [];
            // Adapted from https://stackoverflow.com/a/61928036
            let end = answeringPlayerIndex;
            let start = askingPlayerIndex + 1;
            if (answeringPlayerIndex < askingPlayerIndex) {
                end += PlayerStore.players.length;
            }
            for (let i = start; i < end; i++) {
                tempEmptyPlayers.push(i % PlayerStore.players.length);
            }
            emptyPlayers = tempEmptyPlayers.map((index) => PlayerStore.players[index].id);
        }
        emit("save", {
            ...props.presetValues,
            askingPlayerId: askingPlayerId.value,
            answeringPlayerId: answeringPlayerId.value,
            playersThatDidntHaveAnythingIds: emptyPlayers,
            suspectCardId: suspectCardId.value,
            weaponCardId: weaponCardId.value,
            locationCardId: locationCardId.value,
        });
        emit("close");
    }
};
</script>





































