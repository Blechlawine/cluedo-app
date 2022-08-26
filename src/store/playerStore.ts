import { defineStore } from 'pinia';
import { PlayerInput, PlayerOutput, PlayerValidator } from '../types/validators';
interface IState {
    players: PlayerOutput[];
}
type TGetters = {};
interface IActions {
    upsert: (player: PlayerInput) => void;
}
const usePlayers = defineStore<'players', IState, TGetters, IActions>('players', {
    state: () => ({
        players: [],
    }),
    persist: true,
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
        }
    },
});
export default usePlayers;