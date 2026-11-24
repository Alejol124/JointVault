import type { Context } from "hono";
import { FranchiseService } from "./franchise.service.js";
import { getValidJson, getValidParam } from "../../middlewares/validator.js";
import { idParamSchema } from "../../validator/common.validator.js";
import { createFranchiseSchema, updateFranchiseSchema } from "../../validator/franchise.validator.js";

export class FranchiseController {
    constructor(private franchiseService: FranchiseService) { }

    async getAllFranchises(c: Context): Promise<Response> {
        const franchises = await this.franchiseService.getAllFranchises();
        return c.json(franchises, 200);
    }

    async getById(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const franchise = await this.franchiseService.getById(id);
        return c.json(franchise, 200);
    }

    async create(c: Context): Promise<Response> {
        const franchiseData = getValidJson(c, createFranchiseSchema);
        const newFranchise = await this.franchiseService.create(franchiseData);
        return c.json(newFranchise, 201);
    }

    async delete(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const deleted = await this.franchiseService.delete(id);
        return c.json(deleted, 200);
    }

    async update(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const franchiseData = getValidJson(c, updateFranchiseSchema);
        const updatedFranchise = await this.franchiseService.update(id, franchiseData)
        return c.json(updatedFranchise, 200);
    }
}