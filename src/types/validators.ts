import { z } from "zod";
import * as uuid from "uuid";

export const CardValidator = z.object({
    id: z.string().default(uuid.v4),
    name: z.string(),
});
export type CardInput = z.input<typeof CardValidator>;
export type CardOutput = z.output<typeof CardValidator>;

export const PlayerValidator = z.object({
    id: z.string().default(uuid.v4),
    name: z.string(),
    cardAmount: z.number(),
});
export type PlayerInput = z.input<typeof PlayerValidator>;
export type PlayerOutput = z.output<typeof PlayerValidator>;

export const PlayerCardRelationValidator = z.object({
    playerId: z.string(),
    cardId: z.string(),
    value: z.boolean(),
});
export type PlayerCardRelationInput = z.input<typeof PlayerCardRelationValidator>;
export type PlayerCardRelationOutput = z.output<typeof PlayerCardRelationValidator>;

export const SaveDataValidator = z.object({
    players: z.array(PlayerValidator),
    cards: z.array(CardValidator),
    playerCardRelations: z.array(PlayerCardRelationValidator),
});
export type SaveDataInput = z.input<typeof SaveDataValidator>;
export type SaveDataOutput = z.output<typeof SaveDataValidator>;
