import { defineStore } from "pinia";
import { ref } from "vue";
import { type PlayerInput, type PlayerOutput, PlayerValidator } from "../types/validators";

const usePlayers = defineStore(
    "players",
    () => {
        const players = ref<PlayerOutput[]>([]);

        function upsert(player: PlayerInput) {
            const parsed = PlayerValidator.safeParse(player);
            if (parsed.success) {
                const data = parsed.data;
                const temp = players.value.find((p) => p.id === data.id);
                if (temp) {
                    Object.assign(temp, data);
                } else {
                    players.value.push(data);
                }
            }
        }

        function getByID(id: string): PlayerOutput | undefined {
            return players.value.find((p) => p.id === id);
        }

        function deleteByID(id: string) {
            players.value = players.value.filter((p) => p.id !== id);
        }

        return {
            players,
            upsert,
            getByID,
            deleteByID,
        };
    },
    {
        persist: true,
    },
);

export default usePlayers;
