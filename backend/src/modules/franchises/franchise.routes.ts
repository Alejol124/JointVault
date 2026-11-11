import { Hono } from "hono";
import { FranchiseRepository } from "./franchise.repository.js";
import { FranchiseService } from "./franchise.service.js";
import { FranchiseController } from "./franchise.controller.js";

// Create the specific router for franchise-related routes
const franchiseRouter = new Hono();

const franchiseRepository = new FranchiseRepository();
const franchiseService = new FranchiseService(franchiseRepository);
const franchiseController = new FranchiseController(franchiseService);

franchiseRouter.get("/", (c) => franchiseController.getAllFranchises(c));
franchiseRouter.get("/:id", (c) => franchiseController.getById(c));
franchiseRouter.post("/", (c) => franchiseController.create(c));


export default franchiseRouter;