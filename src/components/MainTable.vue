<template>
    <table class="table table-pin-rows w-max table-fixed">
        <thead>
            <tr>
                <th>{{ $t("cards") }} ({{ CardStore.cards.length }})</th>
                <th
                    :class="` text-ellipsis overflow-hidden whitespace-nowrap`"
                    v-for="player in PlayerStore.players"
                    :key="player.id"
                >
                    {{ player.name }} ({{ player.cardAmount }})
                </th>
            </tr>
        </thead>
        <tr v-for="card in CardStore.cards" :key="card.id">
            <td>
                {{ card.name }}
            </td>
            <td
                v-for="player in PlayerStore.players"
                :key="player.id"
                :class="getTdClasses(player.id, card.id)"
                class="text-center relative"
            >
                <div class="flex flex-col">
                    <div class="absolute top-0 left-0 w-full flex flex-row justify-start">
                        <template
                            v-for="(question, index) in QuestionStore.questions"
                            :key="question.id"
                        >
                            <span
                                class="text-xs tooltip tooltip-error hover:z-50"
                                :data-tip="
                                    $t('does-not-have-this-card-with-question', {
                                        player: player.name,
                                        questionNumber: index + 1,
                                    })
                                "
                                v-if="
                                    question.playersThatDidntHaveAnythingIds.includes(player.id) &&
                                    (question.suspectCardId === card.id ||
                                        question.weaponCardId === card.id ||
                                        question.locationCardId === card.id)
                                "
                            >
                                {{ `Q${index + 1}` }}
                            </span>
                        </template>
                    </div>
                    <div>
                        <button
                            class="btn btn-sm btn-square hover:btn-success btn-ghost tooltip hover:z-50 normal-case"
                            :data-tip="$t('has-this-card')"
                            @click="() => upsertPlayerCardRelation(player.id, card.id, true)"
                        >
                            <Icon name="md-check"></Icon>
                        </button>
                        <button
                            class="btn btn-sm btn-square hover:btn-error btn-ghost tooltip hover:z-50 normal-case"
                            :data-tip="$t('does-not-have-this-card')"
                            @click="() => upsertPlayerCardRelation(player.id, card.id, false)"
                        >
                            <Icon name="md-close"></Icon>
                        </button>
                    </div>
                    <div class="absolute bottom-0 right-0 w-full flex flex-row justify-end">
                        <template
                            v-for="(question, index) in QuestionStore.questions"
                            :key="question.id"
                        >
                            <span
                                class="tooltip tooltip-success text-xs hover:z-20"
                                :data-tip="
                                    $t('showed-this-card-to', {
                                        player: player.name,
                                        otherPlayer: PlayerStore.players.find(
                                            (p) => p.id == question.askingPlayerId
                                        )?.name,
                                        questionNumber: index + 1,
                                    })
                                "
                                v-if="
                                    question.answeringPlayerId === player.id &&
                                    (question.suspectCardId === card.id ||
                                        question.weaponCardId === card.id ||
                                        question.locationCardId === card.id)
                                "
                            >
                                {{
                                    PlayerStore.players
                                        .find((p) => p.id == question.askingPlayerId)
                                        ?.name.substring(0, 1)
                                }}
                            </span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</template>
<script setup lang="ts">
import useCards from "../store/cardStore";
import usePlayerCardRelations from "../store/playerCardRelationStore";
import usePlayers from "../store/playerStore";
import useQuestions from "../store/questionStore";

const CardStore = useCards();
const PlayerStore = usePlayers();
const QuestionStore = useQuestions();
const PlayerCardRelationStore = usePlayerCardRelations();

const getTdClasses = (playerId: string, cardId: string) => {
    const relation = PlayerCardRelationStore.getByPlayerIdAndCardId(playerId, cardId);
    if (relation && relation.value) {
        return "bg-success text-success-content";
    } else if (relation && !relation.value) {
        return "bg-error text-error-content";
    } else {
        return "bg-warning text-warning-content";
    }
};

const upsertPlayerCardRelation = (playerId: string, cardId: string, value: boolean) => {
    PlayerCardRelationStore.upsert({
        playerId,
        cardId,
        value,
    });
};
</script>
