import { getPrompt } from "./db";

class LifterHub {
    async pull(promptName: string): Promise<string | null> {
        return await getPrompt(promptName);
    }
}

// Export singleton instance
export function init(): LifterHub {
    return new LifterHub();
}
