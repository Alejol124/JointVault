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

export interface ICharacterRepository {
    findAll(): Promise<Character[]>;
    findByFranchiseId(id: number): Promise<Character[] | null>;
    create(data: CreateCharacterDTO): Promise<Character>;
    delete(id: number): Promise<Character | null>;
}

export class CharacterRepository {
    async findAll(): Promise<Character[]> {

        const result = await pool.query<Character>(
            'SELECT id, name, franchise_id FROM characters ORDER BY id ASC'
        );
        return result.rows;
    }

    async findByFranchiseId(franchiseId: Number): Promise<Character[] | null> {
        const result = await pool.query(
            'SELECT id, name, franchise_id FROM characters WHERE franchise_id = $1',
            [franchiseId]
        );
        return result.rows ?? null;
    }

    async create(data: CreateCharacterDTO): Promise<Character | null> {
        const result = await pool.query(
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
}