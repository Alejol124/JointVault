import { Hono } from 'hono';
import { ProductLineRepository } from './product-line.repository.js';
import { ProductLineService } from './product-line.service.js';
import { ProductLineController } from './product-line.controller.js';
import { validateJson, validateParams } from '../../middlewares/validator.js';
import { idParamSchema } from '../../validator/common.validator.js';
import { createProductLineSchema, updateProductLineSchema } from '../../validator/product-line.validator.js';

const productLineRouter = new Hono();

const productLineRepository = new ProductLineRepository();
const productLineService = new ProductLineService(productLineRepository);
const productLineController = new ProductLineController(productLineService);

productLineRouter.get("/", (c) => productLineController.getAll(c));
productLineRouter.get("/:id", validateParams(idParamSchema), (c) => productLineController.getById(c));
productLineRouter.post("/", validateJson(createProductLineSchema), (c) => productLineController.create(c));
productLineRouter.patch("/:id", validateParams(idParamSchema), validateJson(updateProductLineSchema), (c) => productLineController.update(c));
productLineRouter.delete("/:id", validateParams(idParamSchema), (c) => productLineController.delete(c));

export default productLineRouter;
