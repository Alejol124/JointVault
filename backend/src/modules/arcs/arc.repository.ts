import pool from "../../database/pool.js";
import type { QueryResultRow } from "pg";

export interface Arc extends QueryResultRow {
    id: number;
    arc_name: string;
    franchise_id: number;
    sort_order: number | null;
}


export interface CreateArcDTO {
    arc_name: string;
    franchise_id: number;
    sort_order: number | null;
}

export type UpdateArcDTO = {
    arc_name?: string | undefined;
    franchise_id?: number | undefined;
    sort_order?: number | undefined;
};

//This one is to avoid a circular dependency, 
// franchiseService does not need to know everything about
// arcs module
export interface IArcChecker {
    hasArcs(franchiseId: number): Promise<boolean>; // Agregado aquí
}

/*
Como ArcRepository implementa IArcRepository, automáticamente 
cumple con IArcChecker sin que tengas que cambiar ni una línea de tus consultas SQL.
*/

export interface IArcRepository extends IArcChecker {
    getAll(): Promise<Arc[]>;
    getByFranchiseId(id: number): Promise<Arc[]>;
    create(data: CreateArcDTO): Promise<Arc>;
    delete(id: number): Promise<Arc | null>
    update(id: number, data: UpdateArcDTO): Promise<Arc | null>;
};

export class ArcRepository implements IArcRepository {

    async getAll(): Promise<Arc[]> {
        const result = await pool.query<Arc>(
            `SELECT id, arc_name, sort_order, franchise_id 
             FROM arcs 
             ORDER BY franchise_id ASC, sort_order ASC NULLS LAST, id ASC`
        );
        return result.rows;
    }

    async getByFranchiseId(franchiseId: number): Promise<Arc[]> {
        const result = await pool.query<Arc>(
            `SELECT id, arc_name, sort_order, franchise_id 
             FROM arcs 
             WHERE franchise_id = $1 
             ORDER BY sort_order ASC NULLS LAST, id ASC`,
            [franchiseId]
        );
        return result.rows;
    }

    async create(data: CreateArcDTO): Promise<Arc> {
        const result = await pool.query<Arc>(
            `INSERT INTO arcs (arc_name, sort_order, franchise_id) 
             VALUES (
                $1, 
                COALESCE($2, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM arcs WHERE franchise_id = $3)), 
                $3
             ) 
             RETURNING id, arc_name, sort_order, franchise_id`,
            [data.arc_name, data.sort_order ?? null, data.franchise_id]
        );

        if (!result.rows[0]) {
            throw new Error("The arc could not be created");
        }

        return result.rows[0];
    }

    async delete(id: number): Promise<Arc | null> {
        const result = await pool.query<Arc>(
            'DELETE FROM arcs WHERE id = $1 RETURNING id, arc_name, sort_order, franchise_id',
            [id]
        );
        return result.rows[0] ?? null;
    }

    async update(id: number, data: UpdateArcDTO): Promise<Arc | null> {
        const result = await pool.query<Arc>(
            `UPDATE arcs 
             SET arc_name = COALESCE($1, arc_name),
                 sort_order = COALESCE($2, sort_order),            
                 franchise_id = COALESCE($3, franchise_id) 
             WHERE id = $4 
             RETURNING id, arc_name, sort_order, franchise_id`,
            [data.arc_name ?? null, data.sort_order ?? null, data.franchise_id ?? null, id]
        );
        return result.rows[0] ?? null;
    }

    async hasArcs(franchiseId: number): Promise<boolean> {
        const result = await pool.query<{ exists: boolean }>(
            `SELECT EXISTS (
            SELECT 1
            FROM arcs
            WHERE franchise_id = $1
        )`,
            [franchiseId]
        );
        return result.rows[0]?.exists ?? false;
    }

}
