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

export type PromptConfiguration = {
    promptType: string;
    description: string;
    systemMessage: string;
    humanMessage: string;
    structuredOutput?: boolean;
    outputFormat?: string;
};

let db: any;
let dbType: "postgres" | "sqlite";

export async function configureDatabase(config: DBConfig) {
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
    await initializeDatabase();
}

export async function fetchPrompt(promptType: string): Promise<PromptConfiguration | null> {
    try {
        let row;
        if (dbType === "postgres") {
            const result = await db.query(
                "SELECT * FROM prompt_configurations WHERE prompt_type = $1",
                [promptType]
            );
            row = result.rows[0];
        } else {
            const stmt = db.prepare("SELECT * FROM prompt_configurations WHERE prompt_type = ?");
            row = stmt.get(promptType);
        }
        if (!row) return null;

        return {
            promptType: row.prompt_type,
            description: row.description,
            systemMessage: row.system_message,
            humanMessage: row.human_message,
            structuredOutput: row.structured_output,
            outputFormat: row.output_format,
        };
    } catch (error) {
        console.error("Error fetching prompt configuration:", error);
        return null;
    }
}

export async function createPrompt(config: PromptConfiguration): Promise<boolean> {
    try {
        if (dbType === "postgres") {
            await db.query(
                `INSERT INTO prompt_configurations 
                 (prompt_type, description, system_message, human_message, structured_output, output_format) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    config.promptType,
                    config.description,
                    config.systemMessage,
                    config.humanMessage,
                    config.structuredOutput ?? false,
                    config.outputFormat || null,
                ]
            );
        } else {
            const stmt = db.prepare(
                `INSERT INTO prompt_configurations 
                 (prompt_type, description, system_message, human_message, structured_output, output_format) 
                 VALUES (?, ?, ?, ?, ?, ?)`
            );
            stmt.run(
                config.promptType,
                config.description,
                config.systemMessage,
                config.humanMessage,
                config.structuredOutput ? 1 : 0,
                config.outputFormat || null
            );
        }
        return true;
    } catch (error) {
        console.error("Error creating prompt configuration:", error);
        return false;
    }
}

export async function updatePrompt(promptType: string, newDescription: string): Promise<boolean> {
    try {
        if (dbType === "postgres") {
            await db.query(
                `UPDATE prompt_configurations 
                 SET description = $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE prompt_type = $2`,
                [newDescription, promptType]
            );
        } else {
            const stmt = db.prepare(
                `UPDATE prompt_configurations 
                 SET description = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE prompt_type = ?`
            );
            stmt.run(newDescription, promptType);
        }
        return true;
    } catch (error) {
        console.error("Error updating prompt configuration:", error);
        return false;
    }
}

export async function deletePrompt(promptType: string): Promise<boolean> {
    try {
        if (dbType === "postgres") {
            await db.query("DELETE FROM prompt_configurations WHERE prompt_type = $1", [promptType]);
        } else {
            const stmt = db.prepare("DELETE FROM prompt_configurations WHERE prompt_type = ?");
            stmt.run(promptType);
        }
        return true;
    } catch (error) {
        console.error("Error deleting prompt configuration:", error);
        return false;
    }
}

export async function initializeDatabase() {
    if (dbType === "postgres") {
        await db.query(`
            CREATE TABLE IF NOT EXISTS prompt_configurations (
                id BIGINT GENERATED BY DEFAULT AS IDENTITY (INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) PRIMARY KEY,
                prompt_type VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                system_message TEXT NOT NULL,
                human_message TEXT NOT NULL,
                structured_output BOOLEAN DEFAULT FALSE,
                output_format TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } else {
        db.exec(`
            CREATE TABLE IF NOT EXISTS prompt_configurations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prompt_type TEXT NOT NULL,
                description TEXT NOT NULL,
                system_message TEXT NOT NULL,
                human_message TEXT NOT NULL,
                structured_output BOOLEAN DEFAULT 0,
                output_format TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }
}
