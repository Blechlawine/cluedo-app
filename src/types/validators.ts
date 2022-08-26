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
