import { z } from "zod";

export const idParamSchema = z.object({
    id: z.coerce
        .number({ error: "ID must be a valid number" })
        .int("ID must be integer")
        .positive("ID must be greater than 0"),
});
