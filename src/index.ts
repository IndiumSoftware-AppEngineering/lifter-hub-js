import { configureDatabase, PromptConfiguration, fetchPrompt, createPrompt, updatePrompt, deletePrompt, DBConfig } from "./db";

class LifterHub {
    async pull(promptType: string): Promise<PromptConfiguration | null> {
        return await fetchPrompt(promptType);
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
}

// Singleton instance
export function init(dbConfig: DBConfig): LifterHub {
    configureDatabase(dbConfig);
    return new LifterHub();
}
