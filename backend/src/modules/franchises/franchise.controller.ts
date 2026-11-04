//FranchiseController.ts
import type { Context } from "hono";
import { FranchiseService } from "./franchise.service.js";

export class FranchiseController {
    constructor(private franchiseService: FranchiseService) { }

    async getAllFranchises(c: Context): Promise<Response> {
        try {
            const franchises = await this.franchiseService.getAllFranchises();
            return c.json(franchises, 200);
        } catch (error) {
            console.error("Error fetching franchises:", error);
            return c.json({ error: "Error obtaining franchises" }, 500);
        }
    }
}