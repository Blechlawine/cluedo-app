import { defineStore } from 'pinia';
import { z } from 'zod';
import { PlayerValidator } from '../types/validators';
interface IState {
    players: z.output<typeof PlayerValidator>[];
}
type TGetters = {};
interface IActions {
    upsert: (player: z.input<typeof PlayerValidator>) => void;
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