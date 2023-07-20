import { GetResponse, ListResponse, SaveResponse } from "../types/api";
import useGameDataStore from "./gameDataStore";
import { useAsyncState } from "@vueuse/core";
import { defineStore } from "pinia";

const useApiStore = defineStore("api", () => {
    const saved = useAsyncState(getList, []);
    const GameDataStore = useGameDataStore();

    async function save(name: string) {
        const body = GameDataStore.serialize(name);
        const response = await fetch("/api/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });
        const savedPath = (await response.json()) as SaveResponse;
        await saved.execute();
        return savedPath;
    }

    async function getOne(id: string) {
        const response = await fetch(`/api/get/${id}`);
        const text = await response.text();
        return text;
    }

    async function getList() {
        const response = await fetch("/api/list", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
        const json = (await response.json()) as ListResponse;
        return json;
    }

    return {
        saved,
        save,
        getOne,
        getList,
    };
});
export default useApiStore;
