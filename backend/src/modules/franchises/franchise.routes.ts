import { Hono } from "hono";
import { FranchiseRepository } from "./franchise.repository.js";
import { FranchiseService } from "./franchise.service.js";
import { FranchiseController } from "./franchise.controller.js";
import { validarJson, validarParams } from "../../middlewares/validator.js"
import { idParamSchema } from "../../validator/common.validator.js"
import { createFranchiseSchema } from "../../validator/franchise.validator.js"

// Create the specific router for franchise-related routes
const franchiseRouter = new Hono();

const franchiseRepository = new FranchiseRepository();
const franchiseService = new FranchiseService(franchiseRepository);
const franchiseController = new FranchiseController(franchiseService);

franchiseRouter.get("/", (c) => franchiseController.getAllFranchises(c));
franchiseRouter.get("/:id", validarParams(idParamSchema), (c) => franchiseController.getById(c));
franchiseRouter.post("/", validarJson(createFranchiseSchema), (c) => franchiseController.create(c));

export default franchiseRouter;