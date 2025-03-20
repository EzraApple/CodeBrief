import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { sendPromptToModel, supportedProviders, compileReportPrompt } from "~/lib/llm";

export const llmRouter = createTRPCRouter({
    // Query to get the available models
    getAvailableModels: publicProcedure.query(() => {
        return supportedProviders;
    }),

    // Mutation to compile a prompt from the provided context and template,
    // then send it to the selected model.
    promptModel: publicProcedure
        .input(
            z.object({
                model: z.string(),
                context: z.string(),
                template: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const { model, context, template } = input;
            // Compile the prompt using the given context and template
            const prompt = compileReportPrompt(context, template);
            // Send the compiled prompt to the specified model and await the response
            const response = await sendPromptToModel(model, prompt);
            return response;
        }),
});
