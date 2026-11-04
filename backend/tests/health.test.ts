import { describe, it, expect } from "vitest";
import app from "../src/app.js"; // Importas tu aplicación de Hono

describe("Test #1 - Health Endpoint", () => {

    it("Debería retornar un estado 200 y un JSON válido", async () => {
        // Hono allows simulating HTTP requests without starting the actual server using app.request()
        const response = await app.request("/health", {
            method: "GET",
        });

        // 1. Verify that the status code is 200 (OK)
        expect(response.status).toBe(200);

        // 2. Verify that the response is the JSON we expect
        const body = await response.json();
        
        expect(body).toEqual({ status: "ok" });
    });
});
