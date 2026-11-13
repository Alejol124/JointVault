import { z } from 'zod';

export const createFranchiseSchema = z.object({
    name: z
        .string({ error: 'Franchise name is required' })
        .trim()
        .min(1, 'Franchise name cannot be empty'),
    uses_arcs: z.union([z.boolean(), z.stringbool()], {
        error: (iss) =>
            iss.input === undefined
                ? 'The field uses_arcs is required'
                : 'The field uses_arcs must be true or false',
    }),
});
