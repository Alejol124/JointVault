import pool from "../../database/pool.js";
import type { QueryResultRow } from "pg";

/* -- 3. Crear tabla Arcs (Depende de franchises)
CREATE TABLE arcs (
    id SERIAL PRIMARY KEY,
    arc_name VARCHAR(60) NOT NULL,
    sort_order INT,
    franchise_id INT NOT NULL,
    FOREIGN KEY (franchise_id) REFERENCES franchises (id) ON DELETE RESTRICT,

    --Los arcos solo se permiten estar asociados a su misma franquicia
    CONSTRAINT uq_arcs_id_franchise UNIQUE (id, franchise_id),
	
    --No permite el mismo nombre de arco en una franquicia, pero si en diferenes
    CONSTRAINT uq_franchise_arc UNIQUE (franchise_id, arc_name)
);
 */

export interface Franchise extends QueryResultRow {
    id: number;
    arc_name: string;
    sort_order?: number;
    franchise_id: number;
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
            throw new Error("The franchise could not be created.");
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
            [data.name, data.uses_arcs, id]
        );
        return result.rows[0] ?? null;
    }
}
