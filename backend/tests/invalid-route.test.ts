import { describe, it, expect } from "vitest";
import app from "../src/app.js"; // Importas tu aplicación de Hono

describe("Test #2 - Invalid Route handling", () => {

    it("Debería retornar un estado 404 para rutas no definidas", async () => {
        // Simulamos una petición a una ruta que no existe
        const response = await app.request("/ruta-inexistente", {
            method: "GET",
        });

        // 1. Verificamos que el código de estado sea 404 (Not Found)
        expect(response.status).toBe(404);

        // 2. Verificamos que la respuesta sea un JSON con el mensaje de error esperado
        const body = await response.json();
        expect(body).toEqual({ error: "Not Found" });
    });
});