export class AppError extends Error {
    /*
    Esto te permite adjuntar el código de estado HTTP (400, 404, 409) directamente 
    cuando lanzas un error desde cualquier servicio, evitando tener que adivinar qué 
    código devolver en tus controladores.
    */
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Marca que es un error controlado de negocio

        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
