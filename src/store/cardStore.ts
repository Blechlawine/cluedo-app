import { defineStore } from "pinia";
import { z } from "zod";
import { CardValidator } from "../types/validators";
interface IState {
    cards: z.output<typeof CardValidator>[];
}
type TGetters = {};
interface IActions {
    upsert: (card: z.input<typeof CardValidator>) => void;
}
const useCards = defineStore<"cards", IState, TGetters, IActions>("cards", {
    state: () => ({
        cards: [],
    }),
    persist: true,
    actions: {
        upsert(card) {
            const parsed = CardValidator.safeParse(card);
            console.log(parsed);
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
    },
});
export default useCards;
