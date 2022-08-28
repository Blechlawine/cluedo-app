import { defineStore } from "pinia";
import { CardInput, CardOutput, CardValidator } from "../types/validators";
interface IState {
    cards: CardOutput[];
}
type TGetters = {
    getByID: (state: IState) => (id: string) => CardOutput | undefined;
    suspects: (state: IState) => CardOutput[];
    weapons: (state: IState) => CardOutput[];
    locations: (state: IState) => CardOutput[];
};
interface IActions {
    upsert: (card: CardInput) => void;
    deleteByID: (id: string) => void;
}
const useCards = defineStore<"cards", IState, TGetters, IActions>("cards", {
    state: () => ({
        cards: [],
    }),
    persist: true,
    getters: {
        getByID: (state) => (id) => state.cards.find((c) => c.id === id),
        suspects: (state) => state.cards.filter((c) => c.category === "suspect"),
        weapons: (state) => state.cards.filter((c) => c.category === "weapon"),
        locations: (state) => state.cards.filter((c) => c.category === "location"),
    },
    actions: {
        upsert(card) {
            const parsed = CardValidator.safeParse(card);
            if (parsed.success) {
                const data = parsed.data;
                let temp = this.cards.find((c) => c.id === data.id);
                if (temp) {
                    Object.assign(temp, data);
                } else {
                    this.cards.push(data);
                }
            }
        },
        deleteByID(id) {
            this.cards = this.cards.filter((c) => c.id !== id);
        },
    },
});
export default useCards;
