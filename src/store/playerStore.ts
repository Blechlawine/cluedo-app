import { defineStore } from 'pinia';
import { z } from 'zod';
import { PlayerValidator } from '../types/validators';
interface IState {
    players: z.output<typeof PlayerValidator>[];
}
type TGetters = {};
interface IActions {}
const usePlayers = defineStore<'players', IState, TGetters, IActions>('players', {
    state: () => ({
        players: [],
    }),
    persist: true,
});
export default usePlayers;