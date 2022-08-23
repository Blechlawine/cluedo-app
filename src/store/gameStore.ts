import { defineStore, StoreDefinition } from "pinia";
import usePlayers from "./playerStore";

interface IState {
    playerStore: ReturnType<typeof usePlayers>;
}
type TGetters = {};
interface IActions {}
const useGame = defineStore<"games", IState, TGetters, IActions>("games", {
    state: () => ({
        playerStore: usePlayers(),
    }),
    persist: true,
});
export default useGame;
