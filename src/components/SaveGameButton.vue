<template>
    <span
        class="tooltip tooltip-right tooltip-success hover:z-50"
        :data-tip="$t('save_game_tooltip')"
    >
        <button
            class="btn btn-sm btn-square text-success hover:btn-success"
            onclick="save_modal.showModal()"
        >
            <Icon name="md-save"></Icon>
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
            >
                {{ $t("download") }}
            </a>
            <button class="btn btn-success btn-sm" @click="">
                {{ $t("upload") }}
            </button>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import useGameDataStore from "../store/gameDataStore";
import FormControl from "../components/FormControl.vue";
import Modal from "../components/Modal.vue";

const GameDataStore = useGameDataStore();

const name = ref("");

const saveData = computed(() => {
    const serialized = GameDataStore.serialize(name.value);
    return encodeURIComponent(serialized);
});
</script>
