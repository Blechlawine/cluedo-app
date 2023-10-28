import { defineStore } from "pinia";
import {
    PlayerCardRelationInput,
    PlayerCardRelationOutput,
    PlayerCardRelationValidator,
} from "../types/validators";
interface IState {
    playerCardRelations: PlayerCardRelationOutput[];
}
type TGetters = {
    getByPlayerIdAndCardId: (
        state: IState,
    ) => (playerId: string, cardId: string) => PlayerCardRelationOutput | undefined;
    getByCardId: (state: IState) => (cardId: string) => PlayerCardRelationOutput[] | [];
};
interface IActions {
    upsert: (PlayerCardRelation: PlayerCardRelationInput) => void;
}
const usePlayerCardRelations = defineStore<"playerCardRelations", IState, TGetters, IActions>(
    "playerCardRelations",
    {
        state: () => ({
            playerCardRelations: [],
        }),
        persist: true,
        getters: {
            getByPlayerIdAndCardId: (state) => (playerId, cardId) =>
                state.playerCardRelations.find(
                    (p) => p.playerId === playerId && p.cardId === cardId,
                ),
            getByCardId: (state) => (cardId) =>
                state.playerCardRelations.filter((p) => p.cardId === cardId),
        },
        actions: {
            upsert(playerCardRelation) {
                const parsed = PlayerCardRelationValidator.safeParse(playerCardRelation);
                if (parsed.success) {
                    const data = parsed.data;
                    const temp = this.playerCardRelations.find(
                        (c) => c.playerId === data.playerId && c.cardId === data.cardId,
                    );
                    if (temp) {
                        Object.assign(temp, data);
                    } else {
                        this.playerCardRelations.push(data);
                    }
                }
            },
        },
    },
);
export default usePlayerCardRelations;
