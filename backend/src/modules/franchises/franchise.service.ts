import type { IFranchiseRepository, Franchise, CreateFranchiseDTO } from "./franchise.repository.js"

export class FranchiseService {

    constructor(private franchiseRepository: IFranchiseRepository) {
        this.franchiseRepository = franchiseRepository;
    }

    getAllFranchises(): Promise<Franchise[]> {
        return this.franchiseRepository.findAll();
    }

    async getById(id: number): Promise<Franchise | null> {
        try {
            const franchise = await this.franchiseRepository.findById(id);
            if (franchise === null) {
                throw new Error("The franchise does not exists")
            }
            return franchise;
        } catch (error) {
            throw error;
        }
    }

    async create(dto: CreateFranchiseDTO): Promise<Franchise | null> {
        try {
            const { name, uses_arcs } = dto;

            return await this.franchiseRepository.create({
                name: name.trim(),
                uses_arcs
            });
        } catch (error: any) {

            if (error.code === '23505') {
                throw new Error("Franchise: " + dto.name + " already exists");
            }

            throw error;
        }
    }

    async delete(id: number): Promise<Franchise | null> {
        try {
            const franchiseToDelete = await this.franchiseRepository.delete(id);


        } catch (error) {
            console.log(error)

        }
        return null;
    }
}

export default FranchiseService;