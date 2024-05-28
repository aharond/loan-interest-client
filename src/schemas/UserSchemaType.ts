import { z } from "zod";

export const UserSchema = z.object({
    id: z.number().gte(1, 'id must greater than 0'),
    amount: z.number().gte(1, 'amount must greater than 0'),
    periodInMonths: z.number().gte(1, 'month must greater than 1'),
});

export type UserSchemaType = z.output<typeof UserSchema>;