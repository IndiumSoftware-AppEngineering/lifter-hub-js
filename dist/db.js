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
exports.getPrompt = getPrompt;
const pg_1 = require("pg");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB_TYPE = process.env.DB_TYPE || "sqlite";
let db;
if (DB_TYPE === "postgres") {
    db = new pg_1.Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT) || 5432,
    });
}
else {
    db = new better_sqlite3_1.default(process.env.SQLITE_DB_PATH || "./prompts.db");
}
/**
 * Fetch prompt content from the database.
 */
function getPrompt(promptName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (DB_TYPE === "postgres") {
                const res = yield db.query("SELECT system_message, human_message FROM prompt_configurations WHERE type = $1", [promptName]);
                return res.rows.length ? res.rows[0].content : null;
            }
            else {
                const stmt = db.prepare("SELECT system_message,human_message FROM prompt_configurations WHERE type = ?");
                const row = stmt.get(promptName);
                return row;
            }
        }
        catch (error) {
            console.error("Error fetching prompt:", error);
            return null;
        }
    });
}
