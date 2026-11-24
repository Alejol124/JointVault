import type { ProductLine, CreateProductLineDTO, UpdateProductLineDTO, IProductLineRepository } from "./product-line.repository.js";
import { AppError } from "../../utils/AppError.js";
import { handleDatabaseError } from "../../utils/dbErrorHandler.js";

export class ProductLineService {

    constructor(private productLineRepository: IProductLineRepository) { }

    async getAll(): Promise<ProductLine[]> {
        return this.productLineRepository.getAll();
    }

    async getById(id: number): Promise<ProductLine> {
        const productLine = await this.productLineRepository.getById(id);
        if (!productLine) {
            throw new AppError(`Product line with ID ${id} does not exist`, 404);
        }
        return productLine;
    }

    async create(dto: CreateProductLineDTO): Promise<ProductLine> {
        try {
            const created = await this.productLineRepository.create({
                name: dto.name,
            });

            if (!created) throw new AppError("Could not create the product line", 500);
            return created;

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            handleDatabaseError(error);
        }
    }

    async update(id: number, dto: UpdateProductLineDTO): Promise<ProductLine> {
        try {
            const updated = await this.productLineRepository.update(id, dto);
            if (!updated) throw new AppError(`Product line with ID ${id} does not exist`, 404);
            return updated;

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            handleDatabaseError(error);
        }
    }

    async delete(id: number): Promise<ProductLine> {
        try {
            const deleted = await this.productLineRepository.delete(id);
            if (!deleted) {
                throw new AppError(`Product line with ID ${id} does not exist`, 404);
            }
            return deleted;

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            handleDatabaseError(error, {
                foreignKeyViolation: "Cannot delete this product line because it still has figures associated with it.",
            });
        }
    }
}
