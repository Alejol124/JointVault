import type { ICharacterRepository, Character, CreateCharacterDTO } from "./character.repository.js";
import { FranchiseService } from '../franchises/franchise.service.js'
import { AppError } from "../../utils/AppError.js";
import { handleDatabaseError } from "../../utils/dbErrorHandler.js";
export class CharacterService {

    constructor(
        private characterRepository: ICharacterRepository,
        private franchiseService: FranchiseService,
    ) { }

    getAllCharacters(): Promise<Character[]> {
        return this.characterRepository.getAll();
    }

    async getByFranchiseId(franchiseId: number): Promise<Character[]> {

        const franchise = await this.franchiseService.getById(franchiseId);
        if (!franchise) {
            throw new Error(`The franchise ID ${franchiseId} does not exist.`);
        }

        const characters = await this.characterRepository.getByFranchiseId(franchiseId);

        return characters ?? [];
    }

    async create(dto: CreateCharacterDTO): Promise<Character | null> {
        try {
            const { name, franchise_id } = dto;

            const created = await this.characterRepository.create({
                name: name,
                franchise_id: franchise_id,
            });

            if (!created) throw new AppError("Could not create the character", 500);
            return created;

        } catch (error: any) {
            // Relaunch error if it is an AppError 
            if (error instanceof AppError) throw error;

            handleDatabaseError(error, {
                foreignKeyViolation: `Franchise with ID ${dto.franchise_id} does not exist`,
                uniqueViolation: `Character "${dto.name}" already exists in this franchise`,
            });
        }
    }

    async delete(id: number): Promise<Character | null> {
        try {
            const deletedCharacter = await this.characterRepository.delete(id);
            if (!deletedCharacter) {
                throw new AppError(`Character with ID ${id} does not exist`, 404);
            }
            return deletedCharacter;

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            handleDatabaseError(error, {
                foreignKeyViolation: "Cannot delete this character because it still has figures associated with it.",
            })
        }
    }
}

