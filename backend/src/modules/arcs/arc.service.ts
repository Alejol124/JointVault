import type { Arc, CreateArcDTO, UpdateArcDTO, IArcRepository } from "./arc.repository.js";
import { FranchiseService } from "../franchises/franchise.service.js";
import { AppError } from "../../utils/AppError.js";
import { handleDatabaseError } from "../../utils/dbErrorHandler.js";
import type { number } from "zod";

export class ArcService {

    constructor(
        private arcRepository: IArcRepository,
        private franchiseService: FranchiseService,
    ) { }

    async getAll(): Promise<Arc[]> {
        const arcs = await this.arcRepository.getAll();
        return arcs;
    }

    async getByFranchiseId(id: number): Promise<Arc[]> {
        const arcs = await this.arcRepository.getByFranchiseId(id);
        return arcs ?? [];
    }

    async create(dto: CreateArcDTO): Promise<Arc> {
        try {
            const { arc_name, sort_order, franchise_id } = dto

            const franchise = await this.franchiseService.getById(franchise_id);

            if (!franchise.uses_arcs) throw new AppError("This franchise does not support arcs", 400);

            const created = await this.arcRepository.create({
                arc_name: arc_name,
                sort_order: sort_order,
                franchise_id: franchise_id,
            });

            if (!created) throw new AppError("Could not create the arc", 500);
            return created;

        } catch (error: any) {
            if (error instanceof AppError) throw error;

            handleDatabaseError(error, {
                foreignKeyViolation: `Franchise with ID ${dto.franchise_id} does not exist`,
                uniqueViolation: `Arc "${dto.arc_name}" already exists in this franchise`,
            })
        }
    }

    async delete(id: number): Promise<Arc> {
        try {
            const deletedArc = await this.arcRepository.delete(id);
            if (!deletedArc) {
                throw new AppError(`Arc with ID ${id} does not exist`, 404);
            }
            return deletedArc;

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            handleDatabaseError(error, {
                foreignKeyViolation: "Cannot delete this arc because it still has figures associated with it.",
            })
        }
    }

    async update(id: number, dto: UpdateArcDTO): Promise<Arc> {
        try {
            if (dto.franchise_id !== undefined) {
                const franchise = await this.franchiseService.getById(dto.franchise_id);
                if (!franchise.uses_arcs) {
                    throw new AppError("This franchise does not support arcs", 400);
                }
            }

            const updatedArc = await this.arcRepository.update(id, dto);
            if (!updatedArc) throw new AppError(`Arc with ID ${id} does not exist`, 404);
            return updatedArc;
        } catch (error: any) {
            if (error instanceof AppError) throw error;

            handleDatabaseError(error, {
                uniqueViolation: `Arc "${dto.arc_name}" already exists in this franchise`
            })
        }
    }

}