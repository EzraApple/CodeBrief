import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { sendPromptToModel, supportedProviders, compileReportPrompt } from "~/lib/llm";
import {reportEmitter} from "~/server/reportEmitter";
import {db} from "~/server/db"

export const llmRouter = createTRPCRouter({
    // Query to get the available models
    getAvailableModels: publicProcedure.query(() => {
        return supportedProviders;
    }),

    promptModel: publicProcedure
        .input(
            z.object({
                model: z.string(),
                context: z.string(),
                template: z.string(),
                reportId: z.string(), // Add the reportId to update the record
            })
        )
        .mutation(async ({ input }) => {
            const { model, context, template, reportId } = input;
            // Compile the prompt
            const prompt = compileReportPrompt(context, template);
            // Send the prompt to the model and await the response
            const response = await sendPromptToModel(model, prompt);

            // Update the report record with the response and set status to complete
            const updatedReport = await db.report.update({
                where: { id: reportId },
                data: {
                    modelResponse: response,
                    status: "complete",
                },
            });

            // Optionally, emit an event for subscribers if you're using subscriptions
            reportEmitter.emit("reportUpdated", updatedReport);

            // Return the response (or updated report, if you prefer)
            return response;
        }),
});
