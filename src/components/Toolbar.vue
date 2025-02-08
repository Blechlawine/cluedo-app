<template>
    <span v-if="$route.path !== '/'" class="btn btn-sm btn-square 2xl:hidden">
        <label for="main-drawer" class="cursor-pointer">
            <div class="i-tabler-x"></div>
        </label>
    </span>
    <span v-if="$route.path !== '/'" class="tooltip tooltip-right hover:z-50" :data-tip="$t('back_to_overview')">
        <router-link to="/" class="btn btn-sm btn-square">
            <div class="i-tabler-arrow-back"></div>
        </router-link>
    </span>
    <span v-else-if="GameDataStore.isGameGoing" class="tooltip tooltip-right hover:z-50">
        <router-link to="/app" class="btn btn-sm btn-square">
            <div class="i-tabler-arrow-forward"></div>
        </router-link>
    </span>
    <span class="tooltip tooltip-right tooltip-error hover:z-50" :data-tip="$t('new_game_tooltip')">
        <button class="btn btn-sm btn-square text-error hover:btn-error" onclick="newGameModal.showModal()">
            <div class="i-tabler-file-plus"></div>
        </button>
    </span>
    <SaveGameButton v-if="GameDataStore.isGameGoing" />
    <LoadGameButton />
    <div class="dropdown">
        <label tabindex="0" class="btn btn-sm">{{ $t("language") }}</label>
        <ul tabindex="0" class="dropdown-content menu z-30 p-2 shadow bg-base-100 rounded-box">
            <li><a @click="LanguageStore.locale = 'en'">English</a></li>
            <li><a @click="LanguageStore.locale = 'de'">Deutsch</a></li>
        </ul>
    </div>

    <Modal name="newGameModal">
        <h3 class="text-lg font-bold">{{ $t("start-new-game") }}</h3>
        <p v-if="GameDataStore.isGameGoing && !GameDataStore.isSaved">
            {{ $t("warning-delete-everything") }}
        </p>
        <template #action>
            <button class="btn btn-sm btn-ghost">
                {{ $t("cancel") }}
            </button>
            <button class="btn btn-sm btn-primary" @click="GameDataStore.startNewGame">
                {{ $t("continue") }}
            </button>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import LoadGameButton from "../components/LoadGameButton.vue";
import Modal from "../components/Modal.vue";
import SaveGameButton from "../components/SaveGameButton.vue";
import useGameDataStore from "../store/gameDataStore";
import useLanguages from "../store/languageStore";

const GameDataStore = useGameDataStore();
const LanguageStore = useLanguages();
</script>
