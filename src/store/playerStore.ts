import { defineStore } from 'pinia';
interface IState {
    players: IPlayer[];
}
type TGetters = {};
interface IActions {}
const usePlayers = defineStore<'players', IState, TGetters, IActions>('players', {
    state: () => ({
        players: [],
    }),
});
export default usePlayers;