"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureDatabase = configureDatabase;
exports.fetchPrompt = fetchPrompt;
exports.fetchAllPrompt = fetchAllPrompt;
exports.createPrompt = createPrompt;
exports.updatePrompt = updatePrompt;
exports.deletePrompt = deletePrompt;
exports.deleteAllPrompt = deleteAllPrompt;
exports.initializeDatabase = initializeDatabase;
const pg_1 = require("pg");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let db;
let dbType;
function configureDatabase(config) {
    return __awaiter(this, void 0, void 0, function* () {
        dbType = config.type;
        if (dbType === "postgres" && config.postgres) {
            db = new pg_1.Pool({
                user: config.postgres.user,
                host: config.postgres.host,
                database: config.postgres.database,
                password: config.postgres.password,
                port: config.postgres.port,
            });
        }
        else if (dbType === "sqlite" && config.sqlite) {
            db = new better_sqlite3_1.default(config.sqlite.path || "./prompts.db");
        }
        else {
            throw new Error("Invalid database configuration");
        }
        yield initializeDatabase();
    });
}
function fetchPrompt(promptType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let row;
            if (dbType === "postgres") {
                const result = yield db.query("SELECT * FROM prompt_configurations WHERE prompt_type = $1", [promptType]);
                row = result.rows[0];
            }
            else {
                const stmt = db.prepare("SELECT * FROM prompt_configurations WHERE prompt_type = ?");
                row = stmt.get(promptType);
            }
            if (!row)
                return null;
            return {
                promptType: row.prompt_type,
                description: row.description,
                systemMessage: row.system_message,
                humanMessage: row.human_message,
                structuredOutput: row.structured_output,
                outputFormat: row.output_format,
            };
        }
        catch (error) {
            console.error("Error fetching prompt configuration:", error);
            return null;
        }
    });
}
function fetchAllPrompt() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let rows;
            if (dbType === "postgres") {
                const result = yield db.query("SELECT * FROM prompt_configurations ORDER BY created_at DESC;");
                rows = result.rows;
            }
            else {
                const stmt = db.prepare("SELECT * FROM prompt_configurations ORDER BY created_at DESC;");
                rows = stmt.all();
            }
            return rows.map((row) => ({
                promptType: row.prompt_type,
                description: row.description,
                systemMessage: row.system_message,
                humanMessage: row.human_message,
                structuredOutput: row.structured_output,
                outputFormat: row.output_format,
            }));
        }
        catch (error) {
            console.error("Error fetching all prompt configurations:", error);
            return [];
        }
    });
}
function createPrompt(config) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            if (dbType === "postgres") {
                yield db.query(`INSERT INTO prompt_configurations 
                 (prompt_type, description, system_message, human_message, structured_output, output_format) 
                 VALUES ($1, $2, $3, $4, $5, $6)`, [
                    config.promptType,
                    config.description,
                    config.systemMessage,
                    config.humanMessage,
                    (_a = config.structuredOutput) !== null && _a !== void 0 ? _a : false,
                    config.outputFormat || null,
                ]);
            }
            else {
                const stmt = db.prepare(`INSERT INTO prompt_configurations 
                 (prompt_type, description, system_message, human_message, structured_output, output_format) 
                 VALUES (?, ?, ?, ?, ?, ?)`);
                stmt.run(config.promptType, config.description, config.systemMessage, config.humanMessage, config.structuredOutput ? 1 : 0, config.outputFormat || null);
            }
            return true;
        }
        catch (error) {
            console.error("Error creating prompt configuration:", error);
            return false;
        }
    });
}
function updatePrompt(promptType, newDescription) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (dbType === "postgres") {
                yield db.query(`UPDATE prompt_configurations 
                 SET description = $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE prompt_type = $2`, [newDescription, promptType]);
            }
            else {
                const stmt = db.prepare(`UPDATE prompt_configurations 
                 SET description = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE prompt_type = ?`);
                stmt.run(newDescription, promptType);
            }
            return true;
        }
        catch (error) {
            console.error("Error updating prompt configuration:", error);
            return false;
        }
    });
}
function deletePrompt(promptType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (dbType === "postgres") {
                yield db.query("DELETE FROM prompt_configurations WHERE prompt_type = $1", [promptType]);
            }
            else {
                const stmt = db.prepare("DELETE FROM prompt_configurations WHERE prompt_type = ?");
                stmt.run(promptType);
            }
            return true;
        }
        catch (error) {
            console.error("Error deleting prompt configuration:", error);
            return false;
        }
    });
}
function deleteAllPrompt() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (dbType === "postgres") {
                yield db.query("DELETE FROM prompt_configurations");
            }
            else {
                db.exec("DELETE FROM prompt_configurations");
            }
            return true;
        }
        catch (error) {
            console.error("Error deleting prompt configuration:", error);
            return false;
        }
    });
}
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (dbType === "postgres") {
            yield db.query(`
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
        }
        else {
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
    });
}
