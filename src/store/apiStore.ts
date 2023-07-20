import { GetResponse, ListResponse, SaveResponse } from "../types/api";
import { SaveDataOutput } from "../types/validators";
import { useAsyncState } from "@vueuse/core";
import { defineStore } from "pinia";
import { ulid } from "ulid";

const useApiStore = defineStore("api", () => {
    const saved = useAsyncState(getList, []);

    async function save(data: SaveDataOutput) {
        const id = ulid();
        const response = await fetch(`/api/save/${id}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        const savedPath = (await response.json()) as SaveResponse;
        await saved.execute();
        return savedPath;
    }

    async function getOne(id: string) {
        const response = await fetch(`/api/get/${id}`);
        const json = (await response.json()) as GetResponse;
        return json;
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
