import { z } from 'zod';

export const createCharacterSchema = z.object({
    name: z
        .string({ error: 'Character name is required' })
        .trim()
        .min(1, 'Character name cannot be empty'),
    franchise_id: z
        .coerce
        .number({ error: "Franchise ID must be a valid number" })
        .int("Franchise ID must be integer")
        .positive("Franchise ID must be greater than 0"),
});

export const updateCharacterSchema = createCharacterSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    });

export type UpdateCharacterDTO = z.infer<typeof updateCharacterSchema>;
