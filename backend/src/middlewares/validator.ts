import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import { z } from 'zod';

const createValidator = <T extends z.ZodType, Target extends keyof ValidationTargets>(
    target: Target,
    schema: T
) =>
    zValidator(target, schema, (result, c) => {
        if (!result.success) {
            return c.json(
                {
                    ok: false,
                    error: 'Invalid data',
                    detalles: result.error.issues.map((i) => ({
                        field: i.path.join('.'),
                        message: i.message,
                    })),
                },
                400,
            );
        }
    });

export const validarJson = <T extends z.ZodType>(schema: T) =>
    createValidator('json', schema);

export const validarParams = <T extends z.ZodType>(schema: T) =>
    createValidator('param', schema);
