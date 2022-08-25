import { defineStore } from 'pinia';
interface IState {
    cards: ICard[];
}
type TGetters = {};
interface IActions {}
const useCards = defineStore<'cards', IState, TGetters, IActions>('cards', {
    state: () => ({
        cards: [],
    }),
});
export default useCards;