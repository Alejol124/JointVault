import type { ICharacterRepository, Character } from "./character.repository.js";
import type { IFranchiseRepository } from "../franchises/franchise.repository.js";

export class CharacterService {

    constructor(
        private characterRepository: ICharacterRepository,
        private franchiseRepository: IFranchiseRepository
    ) { }

    getAllCharacters(): Promise<Character[]> {
        return this.characterRepository.findAll();
    }

    async getByFranchiseId(franchiseId: number): Promise<Character[]> {

        const franchise = await this.franchiseRepository.findById(franchiseId);
        if (!franchise) {
            throw new Error(`The franchise ID ${franchiseId} does not exist.`);
        }

        const characters = await this.characterRepository.findByFranchiseId(franchiseId);

        return characters ?? [];
    }
}


// async create(dto: CreateCharacterDTO): Promise<Character | null> {
//     try {
//         const { name, franchise_id } = dto;
//         if (!name || name.trim() === "") {
//             throw new Error("The character name is obligatory")
//         }

//         if ( ) {

//         }

//     } catch (error: any) {
//         if (error.code = '23503') {
//             throw new Error("Franchise id does not exists")
//         }
//     }
// }