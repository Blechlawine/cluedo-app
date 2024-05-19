import dayjs from "dayjs";
import { defineStore } from "pinia";
import { ulid } from "ulid";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { GameDataValidator } from "../types/validators";
import useCards from "./cardStore";
import usePlayerCardRelations from "./playerCardRelationStore";
import usePlayers from "./playerStore";
import useQuestions from "./questionStore";

const useGameDataStore = defineStore(
    "gameData",
    () => {
        const CardStore = useCards();
        const PlayerStore = usePlayers();
        const QuestionStore = useQuestions();
        const PlayerCardRelationStore = usePlayerCardRelations();
        const Router = useRouter();

        const isSaved = ref(false);

        const gameData = computed(() => ({
            cards: CardStore.cards,
            players: PlayerStore.players,
            questions: QuestionStore.questions,
            playerCardRelations: PlayerCardRelationStore.playerCardRelations,
        }));

        watch(
            gameData,
            () => {
                isSaved.value = false;
            },
            {
                deep: true,
            },
        );

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

        function serialize(name: string, id?: string) {
            return JSON.stringify({
                id: id ?? ulid(),
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
            console.log(input);
            const parsed = GameDataValidator.safeParse(JSON.parse(input));
            if (!parsed.success) {
                console.error(parsed.error);
                return null;
            }
            CardStore.cards = parsed.data.data.cards;
            PlayerStore.players = parsed.data.data.players;
            QuestionStore.questions = parsed.data.data.questions;
            PlayerCardRelationStore.playerCardRelations = parsed.data.data.playerCardRelations;
            isSaved.value = true;
            return parsed.data;
        }

        return {
            serialize,
            deserialize,
            startNewGame,
            isGameGoing,
            isSaved,
        };
    },
    {
        persist: {
            paths: ["isSaved"],
        },
    },
);

export default useGameDataStore;
