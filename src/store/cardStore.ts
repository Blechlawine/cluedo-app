import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { z } from "zod";
import { type CardInput, type CardOutput, CardValidator } from "../types/validators";

const useCards = defineStore(
    "cards",
    () => {
        const cards = ref<CardOutput[]>([]);

        const suspects = computed(() => cards.value.filter((c) => c.category === "suspect"));
        const weapons = computed(() => cards.value.filter((c) => c.category === "weapon"));
        const locations = computed(() => cards.value.filter((c) => c.category === "location"));

        function getByID(id: string) {
            return cards.value.find((c) => c.id === id);
        }

        function upsert(card: CardInput) {
            const parsed = CardValidator.safeParse(card);
            if (parsed.success) {
                const data = parsed.data;
                const temp = cards.value.find((c) => c.id === data.id);
                if (temp) {
                    Object.assign(temp, data);
                } else {
                    cards.value.push(data);
                }
            }
        }

        function insertMany(cardsIn: CardInput[]) {
            const parsed = z.array(CardValidator).safeParse(cardsIn);
            if (parsed.success) {
                cards.value.push(...parsed.data);
            }
        }

        function deleteByID(id: string) {
            cards.value = cards.value.filter((c) => c.id !== id);
        }

        return {
            cards,
            suspects,
            weapons,
            locations,
            upsert,
            insertMany,
            deleteByID,
            getByID,
        };
    },
    {
        persist: true,
    },
);
export default useCards;
