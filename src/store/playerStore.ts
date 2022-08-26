import { defineStore } from "pinia";
import { PlayerInput, PlayerOutput, PlayerValidator } from "../types/validators";
interface IState {
    players: PlayerOutput[];
}
type TGetters = {
    getByID: (state: IState) => (id: string) => PlayerOutput | undefined;
};
interface IActions {
    upsert: (player: PlayerInput) => void;
    deleteByID: (id: string) => void;
}
const usePlayers = defineStore<"players", IState, TGetters, IActions>("players", {
    state: () => ({
        players: [],
    }),
    persist: true,
    getters: {
        getByID: (state) => (id) => state.players.find((p) => p.id === id),
    },
    actions: {
        upsert(player) {
            const parsed = PlayerValidator.safeParse(player);
            if (parsed.success) {
                const data = parsed.data;
                let temp = this.players.find((c) => c.id === data.id);
                if (temp) {
                    Object.assign(temp, data);
                } else {
                    this.players.push(data);
                }
            }
        },
        deleteByID(id) {
            this.players = this.players.filter(p => p.id !== id);
        },
    },
});
export default usePlayers;
