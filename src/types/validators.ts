import { z } from "zod";
import * as uuid from "uuid";

export const CardValidator = z.object({
    id: z.string().default(uuid.v4()),
    name: z.string(),
});

export const PlayerValidator = z.object({
    id: z.string().default(uuid.v4()),
    name: z.string(),
    cardAmount: z.number(),
});
