import {OpenAIProvider} from "~/lib/llm/providers/openaiProvider";

export interface LLMProvider {
    sendPrompt(prompt: string, model?: string): Promise<string>;
}

/**
 * Maps provider names to the list of supported model identifiers.
 */
export const supportedProviders: Record<string, string[]> = {
    "openai" : ["gpt-4o-mini"],
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
        if (models.includes(model)) {
            // Based on the providerName, return the corresponding provider instance.
            if (providerName === "openai") {
                return new OpenAIProvider();
            }
            // If you add more providers later, add additional conditions here.
        }
    }
    throw new Error(`No provider found for model: ${model}`);
}

/**
 * A wrapper function that takes in a model name and a prompt,
 * and dispatches the call to the appropriate provider.
 *
 * @param model - The LLM model identifier (e.g., "gpt4o-mini").
 * @param prompt - The prompt to send.
 * @returns The generated response from the LLM.
 */
export async function sendPromptToModel(model: string, prompt: string): Promise<string> {
    const provider =getProviderForModel(model)
    if (!provider) {
        throw new Error(`No provider configured for model: ${model}`);
    }
    return await provider.sendPrompt(prompt, model);
}