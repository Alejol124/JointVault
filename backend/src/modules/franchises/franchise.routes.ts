import { Hono } from "hono";
import { FranchiseRepository } from "./franchise.repository.js";
import { FranchiseService } from "./franchise.service.js";
import { FranchiseController } from "./franchise.controller.js";
import { validateJson, validateParams } from "../../middlewares/validator.js"
import { idParamSchema } from "../../validator/common.validator.js"
import { createFranchiseSchema, updateFranchiseSchema } from "../../validator/franchise.validator.js"
import { ArcRepository } from "../arcs/arc.repository.js";

// Create the specific router for franchise-related routes
const franchiseRouter = new Hono();

const franchiseRepository = new FranchiseRepository();
const arcRepository = new ArcRepository();
const franchiseService = new FranchiseService(franchiseRepository, arcRepository);
const franchiseController = new FranchiseController(franchiseService);

franchiseRouter.get("/", (c) => franchiseController.getAllFranchises(c));
franchiseRouter.get("/:id", validateParams(idParamSchema), (c) => franchiseController.getById(c));
franchiseRouter.post("/", validateJson(createFranchiseSchema), (c) => franchiseController.create(c));
franchiseRouter.delete("/:id", validateParams(idParamSchema), (c) => franchiseController.delete(c));
franchiseRouter.patch(
    "/:id",
    validateParams(idParamSchema),
    validateJson(updateFranchiseSchema),
    (c) => franchiseController.update(c)
);

export default franchiseRouter;