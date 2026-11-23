import { Context } from "hono";
import { ArcService } from "./arc.service.js";
import { getValidJson, getValidParam, getValidQuery } from "../../middlewares/validator.js";
import { idParamSchema } from "../../validator/common.validator.js";
import { createArcSchema, updateArcSchema, getArcsQuerySchema } from "../../validator/arc.validator.js"

export class ArcController {
    constructor(private arcService: ArcService) { }

    async getArcs(c: Context): Promise<Response> {
        const { franchise_id } = getValidQuery(c, getArcsQuerySchema);

        if (!franchise_id) {
            const arcs = await this.arcService.getAll();
            return c.json(arcs, 200);
        }

        const arcs = await this.arcService.getByFranchiseId(franchise_id);
        return c.json(arcs, 200);
    }


    async create(c: Context): Promise<Response> {
        const arcData = getValidJson(c, createArcSchema);
        const newArc = await this.arcService.create(arcData);
        return c.json(newArc, 201);
    }

    async delete(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const deleted = await this.arcService.delete(id);
        return c.json(deleted, 200);
    }

    async update(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const arcData = getValidJson(c, updateArcSchema);
        const updatedArc = await this.arcService.update(id, arcData);
        return c.json(updatedArc, 200);
    }

}