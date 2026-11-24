import { z } from 'zod';

export const createProductLineSchema = z.object({
    name: z
        .string({ error: 'Product line name is required' })
        .trim()
        .min(1, 'Product line name cannot be empty')
        .max(90, 'Product line name can have at most 90 characters'),
});

export const updateProductLineSchema = createProductLineSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    });
