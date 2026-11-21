import pool from "../../database/pool.js";
import type { QueryResultRow } from "pg";

export interface Franchise extends QueryResultRow {
    id: number;
    name: string;
    uses_arcs: boolean;
}

export interface CreateFranchiseDTO {
    name: string;
    uses_arcs: boolean;
}
export type UpdateFranchiseDTO = Partial<CreateFranchiseDTO>;

export interface IFranchiseRepository {
    findAll(): Promise<Franchise[]>;
    findById(id: number): Promise<Franchise | null>;
    create(data: CreateFranchiseDTO): Promise<Franchise>;
    delete(id: number): Promise<Franchise | null>;
    update(id: number, data: UpdateFranchiseDTO): Promise<Franchise | null>
}

export class FranchiseRepository implements IFranchiseRepository {
    async findAll(): Promise<Franchise[]> {

        const result = await pool.query<Franchise>(
            'SELECT id, name, uses_arcs FROM franchises ORDER BY id ASC'
        );
        return result.rows;
    }

    async findById(id: number): Promise<Franchise | null> {
        // Se añade <Franchise> para asegurar el tipo en la búsqueda
        const result = await pool.query<Franchise>(
            'SELECT id, name, uses_arcs FROM franchises WHERE id = $1',
            [id]
        );
        return result.rows[0] ?? null;
    }

    async create(data: CreateFranchiseDTO): Promise<Franchise> {
        const result = await pool.query<Franchise>(
            'INSERT INTO franchises (name, uses_arcs) VALUES ($1, $2) RETURNING id, name, uses_arcs',
            [data.name, data.uses_arcs]
        );

        if (!result.rows[0]) {
            throw new Error("The franchise could not be created");
        }
        return result.rows[0];
    }

    async delete(id: number): Promise<Franchise | null> {
        const result = await pool.query<Franchise>(
            'DELETE FROM franchises WHERE id = $1 RETURNING id, name, uses_arcs',
            [id]
        );
        return result.rows[0] ?? null;
    }

    async update(id: number, data: UpdateFranchiseDTO): Promise<Franchise | null> {
        const result = await pool.query<Franchise>(
            `UPDATE franchises 
            SET name = COALESCE($1, name), 
            uses_arcs = COALESCE($2, uses_arcs) 
            WHERE id = $3 
            RETURNING id, name, uses_arcs`,
            [data.name ?? null, data.uses_arcs ?? null, id]
        );
        return result.rows[0] ?? null;
    }
}
