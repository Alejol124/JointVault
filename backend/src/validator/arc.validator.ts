import { z } from 'zod';

export const createArcSchema = z.object({
    arc_name: z
        .string({ error: 'Arc name is required' })
        .trim()
        .min(1, 'Character name cannot be empty'),
    sort_order: z
        .coerce
        .number({ error: "Sort order must be a valid number" }),
    franchise_id: z
        .coerce
        .number({ error: "Franchise ID must be a valid number" })
        .int("Franchise ID must be integer")
        .positive("Franchise ID must be greater than 0"),
});

export const getArcsQuerySchema = z.object({
    franchise_id: z.coerce.number().int().positive().optional(),
});

export const updateArcSchema = createArcSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    });