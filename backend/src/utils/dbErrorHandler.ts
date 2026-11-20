import { AppError } from "./AppError.js";

/*
Este helper recibe el error de PostgreSQL y un objeto opcional con mensajes 
personalizados según el contexto de cada tabla (por ejemplo, 
si el 23503 ocurrió al crear o al borrar).
*/

interface DbErrorMessages {
    uniqueViolation?: string;      // 23505
    foreignKeyViolation?: string;  // 23503
    checkViolation?: string;       // 23514
    triggerException?: string;     // P0001
}

export function handleDatabaseError(error: any, customMessages?: DbErrorMessages): never {
    // Si ya es un AppError que lanzamos nosotros mismos (ej. un 404), lo dejamos pasar intacto
    if (error instanceof AppError) {
        throw error;
    }

    switch (error.code) {
        case '23505': // Unique violation
            throw new AppError(
                customMessages?.uniqueViolation || "A record with this unique value already exists.",
                409 // Conflict
            );

        case '23503': // Foreign key violation
        case '23001': // Restrict violation (ON DELETE RESTRICT)
            throw new AppError(
                customMessages?.foreignKeyViolation || "Operation failed due to a reference constraint with related records.",
                409 // Conflict
            );

        case '23514': // Check constraint violation
            throw new AppError(
                customMessages?.checkViolation || "One or more fields violate database validation rules.",
                400 // Bad Request
            );

        case 'P0001': // Trigger RAISE EXCEPTION
            // error.message trae el texto exacto que escribiste en el RAISE EXCEPTION de PostgreSQL
            throw new AppError(
                customMessages?.triggerException || error.message,
                400 // Bad Request
            );

        default:
            // Si es un error desconocido (ej. se cayó la conexión a la BD), lo lanzamos tal cual (será un 500)
            throw error;
    }
}
