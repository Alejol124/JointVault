import { Hono } from "hono";
import { CharacterRepository } from "./character.repository.js";
import { CharacterService } from "./character.service.js";
import { CharacterController } from "./character.controller.js";
import { validateJson, validateParams } from "../../middlewares/validator.js"
import { idParamSchema } from "../../validator/common.validator.js"

import { createCharacterSchema, updateCharacterSchema } from "../../validator/character.validator.js";

// Create the specific router for franchise-related routes
const characterRouter = new Hono();

const characterRepository = new CharacterRepository();

const characterService = new CharacterService(characterRepository);
const characterController = new CharacterController(characterService);

characterRouter.get("/", (c) => characterController.getAllCharacters(c));
characterRouter.get("/:id", validateParams(idParamSchema), (c) => characterController.getByFranchiseId(c));
characterRouter.post("/", validateJson(createCharacterSchema), (c) => characterController.create(c));
characterRouter.delete("/:id", validateParams(idParamSchema), (c) => characterController.delete(c));
// 2. Agregar validateJson(updateCharacterSchema) aquí
characterRouter.patch(
    "/:id",
    validateParams(idParamSchema),
    validateJson(updateCharacterSchema),
    (c) => characterController.update(c)
);

export default characterRouter;