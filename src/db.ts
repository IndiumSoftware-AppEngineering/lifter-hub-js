import { Pool } from "pg";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const DB_TYPE = process.env.DB_TYPE || "sqlite";

let db: any;

if (DB_TYPE === "postgres") {
    db = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT) || 5432,
    });
} else {
    db = new Database(process.env.SQLITE_DB_PATH || "./prompts.db");
}

/**
 * Fetch prompt content from the database.
 */
export async function getPrompt(promptName: string): Promise<string | null> {
    try {
        if (DB_TYPE === "postgres") {
            const res = await db.query("SELECT system_message, human_message FROM prompt_configurations WHERE type = $1", [promptName]);
            return res.rows.length ? res.rows[0].content : null;
        } else {
            const stmt = db.prepare("SELECT system_message,human_message FROM prompt_configurations WHERE type = ?");
            const row = stmt.get(promptName);
            return row
        }
    } catch (error) {
        console.error("Error fetching prompt:", error);
        return null;
    }
}
