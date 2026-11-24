import type { IFranchiseRepository, Franchise, CreateFranchiseDTO, UpdateFranchiseDTO } from "./franchise.repository.js";
import { AppError } from "../../utils/AppError.js";
import { handleDatabaseError } from "../../utils/dbErrorHandler.js";
import type { IArcChecker } from "../arcs/arc.repository.js";

export class FranchiseService {

    constructor(
        private franchiseRepository: IFranchiseRepository,
        private arcChecker: IArcChecker,
    ) { }

    getAllFranchises(): Promise<Franchise[]> {
        return this.franchiseRepository.findAll();
    }

    async getById(id: number): Promise<Franchise> {
        const franchise = await this.franchiseRepository.findById(id);
        if (!franchise) {
            throw new AppError("The franchise does not exist", 404);
        }
        return franchise;
    }

    async create(dto: CreateFranchiseDTO): Promise<Franchise> {
        try {
            const { name, uses_arcs } = dto;

            const created = await this.franchiseRepository.create({
                name: name,
                uses_arcs
            });

            if (!created) throw new AppError("Could not create the franchise", 500);
            return created;

        } catch (error: any) {

            handleDatabaseError(error, {
                uniqueViolation: `Franchise "${dto.name}" already exists.`
            });
        }
    }

    async delete(id: number): Promise<Franchise> {
        try {
            const deletedFranchise = await this.franchiseRepository.delete(id);

            if (!deletedFranchise) {
                throw new AppError("The franchise does not exist", 404);
            }

            return deletedFranchise;
        } catch (error: any) {
            handleDatabaseError(error, {
                foreignKeyViolation: "Cannot delete this franchise because it still has characters, arcs, or figures associated with it."
            });
        }
    }

    async update(id: number, dto: UpdateFranchiseDTO): Promise<Franchise> {
        try {

            if (dto.uses_arcs === false) {
                const franchiseHasArcs = await this.arcChecker.hasArcs(id);
                if (franchiseHasArcs) {
                    throw new AppError(
                        "Cannot disable arcs: this franchise still has arcs. Delete them first.",
                        409
                    );
                }
            }

            const updatedFranchise = await this.franchiseRepository.update(id, dto);
            if (!updatedFranchise) {
                throw new AppError("The franchise does not exist", 404);
            }

            return updatedFranchise;

        } catch (error: any) {
            if (error instanceof AppError) throw error;

            handleDatabaseError(error, {
                uniqueViolation: `Franchise "${dto.name}" already exists.`
            });
        }
    }

}

export default FranchiseService;
