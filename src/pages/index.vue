<template>
    <div class="flex flex-row border-b-2 border-base-300 p-2 gap-2">
        <Toolbar />
    </div>
    <div class="p-2">
        <table class="table">
            <thead>
                <tr>
                    <th>{{ $t("id") }}</th>
                    <th>{{ $t("name") }}</th>
                    <th>{{ $t("timestamp") }}</th>
                    <th>{{ $t("open") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="game in ApiStore.saved.state">
                    <td>{{ game.id }}</td>
                    <td>{{ game.name }}</td>
                    <td>{{ dayjs(game.timestamp).format("LLL") }}</td>
                    <td>
                        <button
                            class="btn hover:btn-warning btn-sm btn-square"
                            @click="openGame(game.id)"
                        >
                            <div class="i-tabler-file-import"></div>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import Toolbar from "../components/Toolbar.vue";
import useApiStore from "../store/apiStore";
import useGameDataStore from "../store/gameDataStore";

const ApiStore = useApiStore();
const GameDataStore = useGameDataStore();
const Router = useRouter();

onMounted(() => {
    ApiStore.saved.execute();
});

async function openGame(id: string) {
    const data = await ApiStore.getOne(id);
    GameDataStore.deserialize(data);
    Router.push("/app");
}
</script>
