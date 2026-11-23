import { Context } from "hono";
import { CharacterService } from "./character.service.js";
import { getValidJson, getValidParam } from "../../middlewares/validator.js";
import { idParamSchema } from "../../validator/common.validator.js";
import { createCharacterSchema, updateCharacterSchema } from "../../validator/character.validator.js";

export class CharacterController {
    constructor(private characterService: CharacterService) { }

    async getAllCharacters(c: Context): Promise<Response> {
        const characters = await this.characterService.getAllCharacters();
        return c.json(characters, 200);
    }

    async getByFranchiseId(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const characters = await this.characterService.getByFranchiseId(id);
        return c.json(characters, 200)
    }

    async create(c: Context): Promise<Response> {
        const characterData = getValidJson(c, createCharacterSchema);
        const newCharacter = await this.characterService.create(characterData);
        return c.json(newCharacter, 201);
    }

    async delete(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const deleted = await this.characterService.delete(id);
        return c.json(deleted, 200);
    }

    async update(c: Context): Promise<Response> {
        const { id } = getValidParam(c, idParamSchema);
        const characterData = getValidJson(c, updateCharacterSchema);
        const updatedCharacter = await this.characterService.update(id, characterData);
        return c.json(updatedCharacter, 200);
    }

}