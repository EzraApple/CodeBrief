// /lib/llm/providers/geminiProvider.ts

import { GoogleGenAI } from '@google/genai';
import { type LLMProvider } from './providerInterface';
import {env} from "~/env"

export class GeminiProvider implements LLMProvider {
    private client: GoogleGenAI;

    constructor() {
        this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    }

    async sendPrompt(prompt: string, model = 'gemini-2.0-flash-001'): Promise<string> {
        const response = await this.client.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    }
}
