import {OpenAIProvider} from "~/lib/llm/providers/openaiProvider";
import {GeminiProvider} from "~/lib/llm/providers/geminiProvider";

export interface LLMProvider {
    sendPrompt(prompt: string, model?: string): Promise<string>;
}

/**
 * Maps provider names to the list of supported model identifiers.
 */
export const supportedProviders: Record<string, string[]> = {
    "openai" : ["gpt-4o-mini"],
    "gemini" : ["gemini-2.0-flash-001"]
};

/**
 * Returns the provider instance for the given model by checking the supportedProviders mapping.
 *
 * @param model - The model identifier (e.g., "gpt-4o-mini").
 * @returns An instance of the corresponding provider.
 * @throws If no provider is found for the provided model.
 */
function getProviderForModel(model: string) {
    // Iterate over each provider name in the mapping.
    for (const providerName in supportedProviders) {
        const models = supportedProviders[providerName];
        if (models?.includes(model)) {
            // Based on the providerName, return the corresponding provider instance.
            if (providerName === "openai") {
                return new OpenAIProvider();
            } else if (providerName === "gemini") {
                return new GeminiProvider()
            }
            // If you add more providers later, add additional conditions here.
        }
    }
    throw new Error(`No provider found for model: ${model}`);
}

/**
 * A wrapper function that takes in a prompt and sends it to the Gemini flash model.
 *
 * @param prompt - The prompt to send.
 * @returns The generated response from the LLM.
 */
export async function sendPromptToModel(prompt: string): Promise<string> {
    const model = "gemini-2.0-flash-001";
    const provider = getProviderForModel(model);
    if (!provider) {
        throw new Error(`No provider configured for model: ${model}`);
    }
    return await provider.sendPrompt(prompt, model);
}