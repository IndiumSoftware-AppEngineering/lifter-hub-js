import { configureDatabase, fetchPrompt, createPrompt, updatePrompt, deletePrompt, DBConfig } from "./db";

class LifterHub {
    async pull(promptName: string): Promise<string | null> {
        return await fetchPrompt(promptName);
    }

    async create(name: string, content: string): Promise<boolean> {
        return await createPrompt(name, content);
    }

    async update(name: string, newContent: string): Promise<boolean> {
        return await updatePrompt(name, newContent);
    }

    async delete(name: string): Promise<boolean> {
        return await deletePrompt(name);
    }
}

// Singleton instance
export function init(dbConfig: DBConfig): LifterHub {
    configureDatabase(dbConfig);
    return new LifterHub();
}
