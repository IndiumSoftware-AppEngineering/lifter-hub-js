import { Pool } from "pg";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

export type DBConfig = {
    type: "postgres" | "sqlite";
    postgres?: {
        user: string;
        host: string;
        database: string;
        password: string;
        port: number;
    };
    sqlite?: {
        path: string;
    };
};

let db: any;
let dbType: "postgres" | "sqlite";

export function configureDatabase(config: DBConfig) {
    dbType = config.type;

    if (dbType === "postgres" && config.postgres) {
        db = new Pool({
            user: config.postgres.user,
            host: config.postgres.host,
            database: config.postgres.database,
            password: config.postgres.password,
            port: config.postgres.port,
        });
    } else if (dbType === "sqlite" && config.sqlite) {
        db = new Database(config.sqlite.path || "./prompts.db");
    } else {
        throw new Error("Invalid database configuration");
    }

    initializeDatabase();
}

export async function fetchPrompt(promptName: string): Promise<string | null> {
    try {
        if (dbType === "postgres") {
            const res = await db.query("SELECT content FROM prompts WHERE name = $1", [promptName]);
            return res.rows.length ? res.rows[0].content : null;
        } else {
            const stmt = db.prepare("SELECT content FROM prompts WHERE name = ?");
            const row = stmt.get(promptName);
            return row ? row.content : null;
        }
    } catch (error) {
        console.error("Error fetching prompt:", error);
        return null;
    }
}

export async function createPrompt(name: string, content: string): Promise<boolean> {
    try {
        if (dbType === "postgres") {
            await db.query("INSERT INTO prompts (name, content) VALUES ($1, $2)", [name, content]);
        } else {
            const stmt = db.prepare("INSERT INTO prompts (name, content) VALUES (?, ?)");
            stmt.run(name, content);
        }
        return true;
    } catch (error) {
        console.error("Error creating prompt:", error);
        return false;
    }
}

export async function updatePrompt(name: string, newContent: string): Promise<boolean> {
    try {
        if (dbType === "postgres") {
            await db.query("UPDATE prompts SET content = $1 WHERE name = $2", [newContent, name]);
        } else {
            const stmt = db.prepare("UPDATE prompts SET content = ? WHERE name = ?");
            stmt.run(newContent, name);
        }
        return true;
    } catch (error) {
        console.error("Error updating prompt:", error);
        return false;
    }
}

export async function deletePrompt(name: string): Promise<boolean> {
    try {
        if (dbType === "postgres") {
            await db.query("DELETE FROM prompts WHERE name = $1", [name]);
        } else {
            const stmt = db.prepare("DELETE FROM prompts WHERE name = ?");
            stmt.run(name);
        }
        return true;
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return false;
    }
}

export async function initializeDatabase() {
    if (dbType === "postgres") {
        await db.query(`
            CREATE TABLE IF NOT EXISTS prompts (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL
            );
        `);
    } else {
        db.exec(`
            CREATE TABLE IF NOT EXISTS prompts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL
            );
        `);
    }
}
