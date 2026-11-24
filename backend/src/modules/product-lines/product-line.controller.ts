import { Context } from "hono";
import { ProductLineService } from "./product-line.service.js";
import { getValidJson, getValidParam } from "../../middlewares/validator.js";
import { idParamSchema } from "../../validator/common.validator.js";
import { createProductLineSchema, updateProductLineSchema } from "../../validator/product-line.validator.js";

export class ProductLineController {
    constructor(private productLineService: ProductLineService) { }

    async getAll(c: Context): Promise<Response> {
        const productLines = await this.productLineService.getAll();
        return c.json(productLines, 200);
    }

    async getById(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const productLine = await this.productLineService.getById(id);
        return c.json(productLine, 200);
    }

    async create(c: Context): Promise<Response> {
        const productLineData = getValidJson(c, createProductLineSchema);
        const newProductLine = await this.productLineService.create(productLineData);
        return c.json(newProductLine, 201);
    }

    async update(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const productLineData = getValidJson(c, updateProductLineSchema);
        const updatedProductLine = await this.productLineService.update(id, productLineData);
        return c.json(updatedProductLine, 200);
    }

    async delete(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const deleted = await this.productLineService.delete(id);
        return c.json(deleted, 200);
    }
}
