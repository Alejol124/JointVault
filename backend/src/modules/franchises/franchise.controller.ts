//FranchiseController.ts
import type { Context } from "hono";
import { FranchiseService } from "./franchise.service.js";
export class FranchiseController {

    private franchiseService: FranchiseService;

    // Recibimos el servicio por inyección de dependencias
    constructor(franchiseService: FranchiseService) {
        this.franchiseService = franchiseService;
    }

    async getAllFranchises(c: Context): Promise<Response> {
        try {
            const franchises = await this.franchiseService.getAllFranchises();
            return c.json(franchises, 200);
        } catch (error) {
            console.error("Error fetching franchises:", error);
            return c.json({ error: "Error obtaining franchises" }, 500);
        }
    }

    async getById(c: Context): Promise<Response> {
        let idParam = null;
        try {
            idParam = Number(c.req.param("id"));

            if (!idParam) {
                return c.json({ error: "Invalid franchise ID" }, 400);
            }

            const franchise = await this.franchiseService.getById(idParam);
            return c.json(franchise, 200);
        } catch (error: any) {

            if (error.message.includes("does not exists")) {
                return c.json({ error: error.message }, 404);
            }

            return c.json({ error: "Error obtaining franchise " + idParam }, 500);
        }
    }

    async create(c: Context): Promise<Response> {
        try {

            const franchiseData = await c.req.json();

            const newFranchise = await this.franchiseService.create(franchiseData);

            return c.json(newFranchise, 201);

        } catch (error: any) {

            // Validamos errores de lógica de negocio o de base de datos (como el nombre duplicado)
            if (error.message.includes("already exists") || error.message.includes("obligatory")) {
                return c.json({ error: error.message }, 400);
            }

            return c.json({ error: "Error creating franchise " + error }, 500);
        }
    }
}