import { PromptConfiguration, DBConfig } from "./db";
declare class LifterHub {
    pull(promptType: string): Promise<PromptConfiguration | null>;
    create(config: PromptConfiguration): Promise<boolean>;
    update(promptType: string, newDescription: string): Promise<boolean>;
    delete(promptType: string): Promise<boolean>;
}
export declare function init(dbConfig: DBConfig): LifterHub;
export {};
