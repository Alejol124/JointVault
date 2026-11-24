import pool from "../../database/pool.js";
import type { QueryResultRow } from "pg";

export interface ProductLine extends QueryResultRow {
    id: number;
    name: string;
}

export interface CreateProductLineDTO {
    name: string;
}

export type UpdateProductLineDTO = {
    name?: string | undefined;
};

export interface IProductLineRepository {
    getAll(): Promise<ProductLine[]>;
    getById(id: number): Promise<ProductLine | null>;
    create(data: CreateProductLineDTO): Promise<ProductLine>;
    update(id: number, data: UpdateProductLineDTO): Promise<ProductLine | null>;
    delete(id: number): Promise<ProductLine | null>;
};

export class ProductLineRepository implements IProductLineRepository {

    async getAll(): Promise<ProductLine[]> {
        const result = await pool.query<ProductLine>(
            'SELECT id, name FROM product_lines ORDER BY name ASC, id ASC'
        );
        return result.rows;
    }

    async getById(id: number): Promise<ProductLine | null> {
        const result = await pool.query<ProductLine>(
            'SELECT id, name FROM product_lines WHERE id = $1',
            [id]
        );
        return result.rows[0] ?? null;
    }

    async create(data: CreateProductLineDTO): Promise<ProductLine> {
        const result = await pool.query<ProductLine>(
            'INSERT INTO product_lines (name) VALUES ($1) RETURNING id, name',
            [data.name]
        );

        if (!result.rows[0]) {
            throw new Error("The product line could not be created");
        }

        return result.rows[0];
    }

    async update(id: number, data: UpdateProductLineDTO): Promise<ProductLine | null> {
        const result = await pool.query<ProductLine>(
            `UPDATE product_lines
             SET name = COALESCE($1, name)
             WHERE id = $2
             RETURNING id, name`,
            [data.name ?? null, id]
        );
        return result.rows[0] ?? null;
    }

    async delete(id: number): Promise<ProductLine | null> {
        const result = await pool.query<ProductLine>(
            'DELETE FROM product_lines WHERE id = $1 RETURNING id, name',
            [id]
        );
        return result.rows[0] ?? null;
    }
}
