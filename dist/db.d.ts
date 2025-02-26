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
    id?: number;
    prompt_type: string;
    description: string;
    system_message: string;
    human_message: string;
    structured_output?: boolean;
    output_format?: string;
};
export declare function configureDatabase(config: DBConfig): Promise<void>;
export declare function fetchPrompt(promptType: string): Promise<PromptConfiguration | null>;
export declare function fetchAllPrompt(): Promise<PromptConfiguration[]>;
export declare function createPrompt(config: PromptConfiguration): Promise<boolean>;
export declare function updatePrompt(promptType: string, newDescription: string): Promise<boolean>;
export declare function deletePrompt(id: number): Promise<boolean>;
export declare function deleteAllPrompt(): Promise<boolean>;
export declare function initializeDatabase(): Promise<void>;
