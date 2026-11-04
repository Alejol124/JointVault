import { Hono } from "hono";
import { FranchiseRepository } from "./franchise.repository.js";
import { FranchiseService } from "./franchise.service.js";
import { FranchiseController } from "./franchise.controller.js";

// Create the specific router for franchise-related routes
const franchiseRouter = new Hono();

const franchiseRepository = new FranchiseRepository();
const franchiseService = new FranchiseService(franchiseRepository);
const franchiseController = new FranchiseController(franchiseService);

// Define the route for getting all franchises
franchiseRouter.get("/", (c) => franchiseController.getAllFranchises(c));

export default franchiseRouter;