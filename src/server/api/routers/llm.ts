import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { sendPromptToModel, supportedProviders, compileReportPrompt } from "~/lib/llm";
import {reportEmitter} from "~/server/reportEmitter";
import {db} from "~/server/db"
import {compileTemplate} from "~/lib/llm/templates/compileTemplate";
import {extractTemplateSectionNames} from "~/lib/llm/templates/getAvailableSections";
import {templateSections} from "~/lib/llm/templates/defaultSections";

export const llmRouter = createTRPCRouter({
    // Query to get the available models
    getAvailableModels: publicProcedure.query(() => {
        return supportedProviders;
    }),

    getTemplateSectionNames: publicProcedure.query(() => {
        return extractTemplateSectionNames(templateSections);
    }),

    promptModel: publicProcedure
        .input(
            z.object({
                context: z.string(),
                templateSections: z.array(z.string()),
                reportId: z.string(), // Add the reportId to update the record
            })
        )
        .mutation(async ({ input }) => {
            const { context, templateSections, reportId } = input;

            const template = compileTemplate(templateSections)
            // Compile the prompt
            const prompt = compileReportPrompt(context, template);
            // Send the prompt to the model and await the response
            let response = await sendPromptToModel(prompt);

            // Remove the first line if it is "```markdown"
            if (response.startsWith("```markdown")) {
                response = response.split("\n").slice(1).join("\n").trim();
            }

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
