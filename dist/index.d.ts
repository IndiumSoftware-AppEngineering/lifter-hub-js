declare class LifterHub {
    pull(promptName: string): Promise<string | null>;
}
export declare function init(): LifterHub;
export {};
