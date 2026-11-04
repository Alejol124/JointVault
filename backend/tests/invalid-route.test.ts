import { describe, it, expect } from "vitest";
import app from "../src/app.js"; // Importas tu aplicación de Hono

describe("Test #2 - Invalid Route handling", () => {

    it("Debería retornar un estado 404 para rutas no definidas", async () => {
        //We simulate a request to a non-existent route
        const response = await app.request("/ruta-inexistente", {
            method: "GET",
        });

        // 1. Verify thaat the status code is 404 (NOT FOUND)
        expect(response.status).toBe(404);

        // 2. Verify that the response is a JSON with the expected error message
        const body = await response.json();
        expect(body).toEqual({ error: "Not Found" });
    });
});