import pool from "../../database/pool.js";
import type { QueryResultRow } from "pg";

export interface Character extends QueryResultRow {
    id: number;
    name: string;
    franchise_id: number;
}

export interface CreateCharacterDTO {
    name: string;
    franchise_id: number;
}

// En character.repository.ts:
export type UpdateCharacterDTO = {
    name?: string | undefined;
    franchise_id?: number | undefined;
};
export interface ICharacterRepository {
    getAll(): Promise<Character[]>;
    getByFranchiseId(franchiseId: number): Promise<Character[]>;
    create(data: CreateCharacterDTO): Promise<Character>;
    delete(id: number): Promise<Character | null>;
    update(id: number, data: UpdateCharacterDTO): Promise<Character | null>;
}

export class CharacterRepository implements ICharacterRepository {
    async getAll(): Promise<Character[]> {

        const result = await pool.query<Character>(
            'SELECT id, name, franchise_id FROM characters ORDER BY id ASC'
        );
        return result.rows;
    }

    async getByFranchiseId(franchiseId: number): Promise<Character[]> {
        const result = await pool.query<Character>(
            'SELECT id, name, franchise_id FROM characters WHERE franchise_id = $1',
            [franchiseId]
        );
        return result.rows;
    }

    async create(data: CreateCharacterDTO): Promise<Character> {
        const result = await pool.query<Character>(
            'INSERT INTO characters (name, franchise_id) VALUES ($1,$2) RETURNING id, name, franchise_id',
            [data.name, data.franchise_id]
        );

        if (!result.rows[0]) {
            throw new Error("The character could not be created");
        }

        return result.rows[0];
    }

    async delete(id: number): Promise<Character | null> {
        const result = await pool.query<Character>(
            'DELETE FROM characters WHERE id = $1 RETURNING id, name, franchise_id',
            [id]
        );
        return result.rows[0] ?? null;
    }

    async update(id: number, data: UpdateCharacterDTO): Promise<Character | null> {
        const result = await pool.query<Character>(
            `UPDATE characters 
         SET name = COALESCE($1, name), 
             franchise_id = COALESCE($2, franchise_id) 
         WHERE id = $3 
         RETURNING id, name, franchise_id`,
            [data.name ?? null, data.franchise_id ?? null, id]
        );
        return result.rows[0] ?? null;
    }

}