import { defineStore } from "pinia";
import {
    type PlayerCardRelationInput,
    type PlayerCardRelationOutput,
    PlayerCardRelationValidator,
} from "../types/validators";
import { ref } from "vue";

const usePlayerCardRelations = defineStore(
    "playerCardRelations",
    () => {
        const playerCardRelations = ref<PlayerCardRelationOutput[]>([]);

        function getByPlayerIdAndCardId(
            playerId: string,
            cardId: string,
        ): PlayerCardRelationOutput | undefined {
            return playerCardRelations.value.find(
                (p) => p.playerId === playerId && p.cardId === cardId,
            );
        }

        function getByCardId(cardId: string): PlayerCardRelationOutput[] {
            return playerCardRelations.value.filter((p) => p.cardId === cardId);
        }

        function upsert(playerCardRelation: PlayerCardRelationInput) {
            const parsed = PlayerCardRelationValidator.safeParse(playerCardRelation);
            if (parsed.success) {
                const data = parsed.data;
                const temp = playerCardRelations.value.find(
                    (c) => c.playerId === data.playerId && c.cardId === data.cardId,
                );
                if (temp) {
                    Object.assign(temp, data);
                } else {
                    playerCardRelations.value.push(data);
                }
            }
        }

        return {
            playerCardRelations,
            getByPlayerIdAndCardId,
            getByCardId,
            upsert,
        };
    },
    { persist: true },
);

export default usePlayerCardRelations;
