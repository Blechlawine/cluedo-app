import { GameDataValidator } from "../types/validators";
import useCards from "./cardStore";
import usePlayerCardRelations from "./playerCardRelationStore";
import usePlayers from "./playerStore";
import useQuestions from "./questionStore";
import dayjs from "dayjs";
import { defineStore } from "pinia";
import { ulid } from "ulid";
import { computed } from "vue";
import { useRouter } from "vue-router";

const useGameDataStore = defineStore("gameData", () => {
    const CardStore = useCards();
    const PlayerStore = usePlayers();
    const QuestionStore = useQuestions();
    const PlayerCardRelationStore = usePlayerCardRelations();
    const Router = useRouter();

    const isGameGoing = computed(
        () =>
            PlayerStore.players.length > 0 ||
            QuestionStore.questions.length > 0 ||
            PlayerCardRelationStore.playerCardRelations.length > 0 ||
            CardStore.cards.length > 0,
    );

    function startNewGame() {
        PlayerStore.players = [];
        CardStore.cards = [];
        QuestionStore.questions = [];
        PlayerCardRelationStore.playerCardRelations = [];
        Router.push("/app");
    }

    function serialize(name: string) {
        console.log("test");
        return JSON.stringify({
            id: ulid(),
            name,
            timestamp: dayjs().toISOString(),
            data: {
                cards: CardStore.cards,
                players: PlayerStore.players,
                questions: QuestionStore.questions,
                playerCardRelations: PlayerCardRelationStore.playerCardRelations,
            },
        });
    }

    function deserialize(input: string) {
        const parsed = GameDataValidator.safeParse(JSON.parse(input));
        if (!parsed.success) {
            console.error(parsed.error);
            return null;
        }
        CardStore.cards = parsed.data.data.cards;
        PlayerStore.players = parsed.data.data.players;
        QuestionStore.questions = parsed.data.data.questions;
        PlayerCardRelationStore.playerCardRelations = parsed.data.data.playerCardRelations;
        return parsed.data;
    }
    return {
        serialize,
        deserialize,
        startNewGame,
        isGameGoing,
    };
});

export default useGameDataStore;
