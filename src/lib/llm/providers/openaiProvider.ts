
// /lib/llm/providers/openaiProvider.ts

import OpenAI from "openai";
import {type LLMProvider} from "./providerInterface";

export class OpenAIProvider implements LLMProvider {
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI();
    }

    async sendPrompt(prompt: string, model = "gpt-4o-mini"): Promise<string> {
        const completion = await this.client.chat.completions.create({
            model,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        return completion.choices[0].message.content;
    }
}
