<template>
    <span
        class="tooltip tooltip-right tooltip-success hover:z-50"
        :data-tip="GameDataStore.isSaved ? $t('already_saved') : $t('save_game_tooltip')"
    >
        <button
            class="btn btn-sm btn-square text-success hover:btn-success"
            onclick="save_modal.showModal()"
        >
            <div class="i-tabler-device-floppy"></div>
        </button>
    </span>
    <Modal name="save_modal">
        <FormControl :label="$t('name')">
            <input class="input input-bordered" type="text" name="name" id="name" v-model="name" />
        </FormControl>
        <template #action>
            <a
                class="btn btn-sm"
                :href="`data:text/json;charset=utf-8,${saveData}`"
                :download="`${name}.json`"
                @click="GameDataStore.isSaved = true"
            >
                {{ $t("download") }}
            </a>
            <button class="btn btn-success btn-sm" @click="upload">
                {{ $t("upload") }}
            </button>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import FormControl from "../components/FormControl.vue";
import Modal from "../components/Modal.vue";
import useApiStore from "../store/apiStore";
import useGameDataStore from "../store/gameDataStore";

const GameDataStore = useGameDataStore();
const ApiStore = useApiStore();

const name = ref("");

const saveData = computed(() => {
    const serialized = GameDataStore.serialize(name.value);
    return encodeURIComponent(serialized);
});

async function upload() {
    await ApiStore.save(name.value);
    GameDataStore.isSaved = true;
}
</script>
