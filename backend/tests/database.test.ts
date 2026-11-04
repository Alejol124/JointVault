import { describe, it, expect, afterAll } from "vitest";
import pool from "../src/database/pool.js";

describe("Integration Test #1 - DB Connection Test", () => {

    it("Debería retornar hora del servidor y nombre de la bd", async () => {
        const result = await pool.query("SELECT NOW() AS server_time, current_database() AS database_name;");

        expect(result.rows.length).toBeGreaterThan(0);
        
        expect(result.rows[0]).toHaveProperty("server_time");
        expect(result.rows[0]).toHaveProperty("database_name");

        const dbName = result.rows[0].database_name;
        expect(dbName).toBe('joint_vault');
    });

    afterAll(async () => {
        await pool.end(); // This close all connections in the pool and releases resources. It's important to call this after all tests are done to avoid hanging connections.
    })
});