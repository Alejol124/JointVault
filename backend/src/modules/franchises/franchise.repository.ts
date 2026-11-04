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

export interface IFranchiseRepository {
    findAll(): Promise<Franchise[]>;
    findById(id: number): Promise<Franchise | null>;
    create(data: CreateFranchiseDTO): Promise<Franchise>;
}

// 3. Implementa la Interfaz con Genéricos
export class FranchiseRepository implements IFranchiseRepository {
    async findAll(): Promise<Franchise[]> {
        // Se añade <Franchise> para que result.rows sea de tipo Franchise[]
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
            throw new Error("No se pudo crear la franquicia.");
        }
        return result.rows[0];
    }
}
