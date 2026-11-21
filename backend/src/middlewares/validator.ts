import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import { z } from 'zod';
import { Context } from 'hono';

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

export const validateJson = <T extends z.ZodType>(schema: T) =>
    createValidator('json', schema);

export const validateParams = <T extends z.ZodType>(schema: T) =>
    createValidator('param', schema);

// Helpers to obtain validated data from Zod 
export const getValidJson = <T extends z.ZodType>(c: Context, _schema: T): z.infer<T> => {
    return (c.req as any).valid('json');
};

export const getValidParam = <T extends z.ZodType>(c: Context, _schema: T): z.infer<T> => {
    return (c.req as any).valid('param');
};