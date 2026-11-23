import { Hono } from 'hono';
import { ArcRepository } from './arc.repository.js';
import { ArcService } from './arc.service.js';
import { ArcController } from './arc.controller.js';
import { validateJson, validateParams, validateQuery } from '../../middlewares/validator.js';
import { idParamSchema } from '../../validator/common.validator.js';
import { createArcSchema, updateArcSchema, getArcsQuerySchema } from '../../validator/arc.validator.js';

import { FranchiseRepository } from '../franchises/franchise.repository.js';
import { FranchiseService } from '../franchises/franchise.service.js';


const ArcRouter = new Hono();

const franchiseRepository = new FranchiseRepository();
const franchiseService = new FranchiseService(franchiseRepository);

const arcRepository = new ArcRepository();
const arcService = new ArcService(arcRepository, franchiseService);
const arcController = new ArcController(arcService);


ArcRouter.get("/", validateQuery(getArcsQuerySchema), (c) => arcController.getArcs(c));
ArcRouter.post("/", validateJson(createArcSchema), (c) => arcController.create(c));
ArcRouter.patch("/:id", validateParams(idParamSchema), validateJson(updateArcSchema), (c) => arcController.update(c));
ArcRouter.delete("/:id", validateParams(idParamSchema), (c) => arcController.delete(c));

export default ArcRouter;