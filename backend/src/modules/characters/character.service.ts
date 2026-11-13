import type { ICharacterRepository, Character, CharacterRepository, CreateCharacterDTO } from "./character.repository.js";

export class CharacterService {

    constructor(private characterRepository: ICharacterRepository) {
        this.characterRepository = characterRepository;
    }

    getAllCharacters(): Promise<Character[]> {
        return this.characterRepository.findAll();
    }

    async getById(id: number): Promise<Character | null> {
        try {
            const character = await this.characterRepository.findById(id);
            if (character === null) {
                throw new Error("The character does not exists")
            }
            return character;
        } catch (error) {
            throw error;
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
}