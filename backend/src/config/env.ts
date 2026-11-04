import "dotenv/config";
import { z } from "zod";

// Definimos el esquema de validación para las variables de entorno
const envSchema = z.object({
    PORT: z  // 1. Aceptamos el string que viene del archivo .env o del entorno
        .string()
        // 2. Si no viene nada, le damos un valor por defecto (como string)
        .default("3000")

        .refine((val) => /^\d+$/.test(val), { message: "El puerto solo puede contener números, no se admiten letras" })

        // 3. Intentamos transformarlo a número
        .transform((val) => parseInt(val, 10))
        // 4. Validamos que el resultado de la transformación sea un número válido y esté en el rango correcto
        .pipe(
            z.number()
                .int({ message: "El puerto debe ser un número entero" })
                .min(1, { message: "El puerto mínimo es 1" })
                .max(65535, { message: "El puerto máximo es 65535" })
        ),
    NODE_ENV: z.enum((["development", "production", "test"])).default("development"),

    //DATABASE variables
    PGHOST: z.string().nonempty({ message: "PGHOST no puede estar vacío" }).trim().min(1).default("localhost"),
    PGPORT: z.string().nonempty({ message: "PGPORT no puede estar vacío" }).default("5432")
        .refine((val) => /^\d+$/.test(val), { message: "El puerto solo puede contener números, no se admiten letras" }).transform((val) => parseInt(val, 10)).pipe(
            z.number()
                .int({ message: "PGPORT debe ser un número entero" })
                .min(1, { message: "El puerto mínimo es 1" })
                .max(65535, { message: "El puerto máximo es 65535" })
        ),
    PGDATABASE: z.string().nonempty({ message: "PGDATABASE no puede estar vacío" }),
    PGUSER: z.string().nonempty({ message: "PGUSER no puede estar vacío" }),
    PGPASSWORD: z.string().nonempty({ message: "PGPASSWORD no puede estar vacío" })
});

// Validamos las variables de entorno y lanzamos un error si alguna no cumple con el esquema
const env = envSchema.safeParse(process.env);
if (!env.success) {
    console.error("Invalid environment variables: ", env.error.message);
    process.exit(1);
};

// Exportamos las variables de entorno validadas
export const appConfig = {
    PORT: env.data.PORT,
    NODE_ENV: env.data.NODE_ENV,
    PGHOST: env.data.PGHOST,
    PGPORT: env.data.PGPORT,
    PGDATABASE: env.data.PGDATABASE,
    PGUSER: env.data.PGUSER,
    PGPASSWORD: env.data.PGPASSWORD
};