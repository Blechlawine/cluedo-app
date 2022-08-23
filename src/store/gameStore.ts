import { defineStore } from "pinia";
interface IState {
    game: IGame | null;
}
type TGetters = {};
interface IActions {}
const useGames = defineStore<"games", IState, TGetters, IActions>("games", {
    state: () => ({
        game: null,
    }),
    persist: true,
    actions: {
        
    },
});
export default useGames;
