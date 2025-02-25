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
export declare function configureDatabase(config: DBConfig): Promise<void>;
export declare function fetchPrompt(promptType: string): Promise<PromptConfiguration | null>;
export declare function createPrompt(config: PromptConfiguration): Promise<boolean>;
export declare function updatePrompt(promptType: string, newDescription: string): Promise<boolean>;
export declare function deletePrompt(promptType: string): Promise<boolean>;
export declare function initializeDatabase(): Promise<void>;
