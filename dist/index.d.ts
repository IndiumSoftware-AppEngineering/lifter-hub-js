export type { DBConfig } from "./db";
import { PromptConfiguration, DBConfig } from "./db";
declare class LifterHub {
    pull(promptType: string): Promise<PromptConfiguration | null>;
    pullAll(): Promise<PromptConfiguration[]>;
    create(config: PromptConfiguration): Promise<boolean>;
    update(promptType: string, newDescription: string): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    deleteAll(): Promise<boolean>;
}
export declare function init(dbConfig: DBConfig): LifterHub;
