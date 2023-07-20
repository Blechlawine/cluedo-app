import { ulid } from "ulid";
import { z } from "zod";

export const CardValidator = z.object({
    id: z.string().default(ulid),
    name: z.string(),
    category: z.enum(["suspect", "weapon", "location"]).default("suspect"),
});
export type CardInput = z.input<typeof CardValidator>;
export type CardOutput = z.output<typeof CardValidator>;

export const PlayerValidator = z.object({
    id: z.string().default(ulid),
    name: z.string(),
    cardAmount: z.number(),
});
export type PlayerInput = z.input<typeof PlayerValidator>;
export type PlayerOutput = z.output<typeof PlayerValidator>;

export const QuestionValidator = z.object({
    id: z.string().default(ulid),
    askingPlayerId: z.string(),
    answeringPlayerId: z.string().nullable(),
    playersThatDidntHaveAnythingIds: z.array(z.string()),
    suspectCardId: z.string(),
    weaponCardId: z.string(),
    locationCardId: z.string(),
    timestamp: z.string().default(() => new Date().toISOString()),
});
export type QuestionInput = z.input<typeof QuestionValidator>;
export type QuestionOutput = z.output<typeof QuestionValidator>;

export const PlayerCardRelationValidator = z.object({
    playerId: z.string(),
    cardId: z.string(),
    value: z.boolean(),
});
export type PlayerCardRelationInput = z.input<typeof PlayerCardRelationValidator>;
export type PlayerCardRelationOutput = z.output<typeof PlayerCardRelationValidator>;

export const GameDataValidator = z.object({
    id: z.string(),
    name: z.string(),
    timestamp: z.string(),
    data: z.object({
        cards: z.array(CardValidator),
        players: z.array(PlayerValidator),
        questions: z.array(QuestionValidator),
        playerCardRelations: z.array(PlayerCardRelationValidator),
    }),
});

export type GameDataInput = z.input<typeof GameDataValidator>;
export type GameDataOutput = z.output<typeof GameDataValidator>;
