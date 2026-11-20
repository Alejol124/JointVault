import { Hono } from "hono";
import { CharacterRepository } from "./character.repository.js";
import { CharacterService } from "./character.service.js";
import { CharacterController } from "./character.controller.js";
import { validarJson, validarParams } from "../../middlewares/validator.js"
import { idParamSchema } from "../../validator/common.validator.js"

import { FranchiseRepository } from "../franchises/franchise.repository.js";
import { FranchiseService } from "../franchises/franchise.service.js";
import { createCharacterSchema } from "../../validator/character.validator.js";

// Create the specific router for franchise-related routes
const characterRouter = new Hono();

const characterRepository = new CharacterRepository();
const franchiseRepository = new FranchiseRepository();

const franchiseService = new FranchiseService(franchiseRepository);

const characterService = new CharacterService(characterRepository, franchiseService);
const characterController = new CharacterController(characterService);

characterRouter.get("/", (c) => characterController.getAllCharacters(c));
characterRouter.get("/:id", validarParams(idParamSchema), (c) => characterController.getByFranchiseId(c));
characterRouter.post("/", validarJson(createCharacterSchema), (c) => characterController.create(c));
characterRouter.delete("/:id", validarParams(idParamSchema), (c) => characterController.delete(c));

export default characterRouter;