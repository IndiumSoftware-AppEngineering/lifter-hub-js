export type { DBConfig } from "./db";
import { configureDatabase, PromptConfiguration, fetchPrompt, fetchAllPrompt, createPrompt, updatePrompt, deletePrompt, deleteAllPrompt, DBConfig } from "./db";

class LifterHub {
    async pull(promptType: string): Promise<PromptConfiguration | null> {
        return await fetchPrompt(promptType);
    }

    async pullAll(): Promise<PromptConfiguration[]> {
        return await fetchAllPrompt();
    }

    async create(config: PromptConfiguration): Promise<boolean> {
        return await createPrompt(config);
    }

    async update(promptType: string, newDescription: string): Promise<boolean> {
        return await updatePrompt(promptType, newDescription);
    }

    async delete(promptType: string): Promise<boolean> {
        return await deletePrompt(promptType);
    }

    async deleteAll(): Promise<boolean> {
        return await deleteAllPrompt();
    }

}

// Singleton instance
export function init(dbConfig: DBConfig): LifterHub {
    configureDatabase(dbConfig);
    return new LifterHub();
}
