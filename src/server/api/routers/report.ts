// src/server/api/trpc/routers/report.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import {reportEmitter} from "~/server/reportEmitter";

export const reportRouter = createTRPCRouter({

    create: publicProcedure
        .input(
            z.object({
                userId: z.string(),
                repoUrl: z.string().url(),
            })
        )
        .mutation(async ({ input }) => {
            return db.report.create({
                data: {
                    repoUrl: input.repoUrl,
                    userId: input.userId,
                    status: "pending",
                },
            });
        }),




    // Update the report with the model response when ready
    updateReportResponse: publicProcedure
        .input(
            z.object({
                reportId: z.string(),
                modelResponse: z.string(),
                status: z.string().optional(), // default to "complete"
            })
        )
        .mutation(async ({ input }) => {
            const updatedReport = await db.report.update({
                where: { id: input.reportId },
                data: {
                    modelResponse: input.modelResponse,
                    status: input.status ?? "complete",
                },
            });
            // Emit an event so subscribers are notified of the update.
            reportEmitter.emit("reportUpdated", updatedReport);
            return updatedReport;
        }),

    // Subscription for report updates (see next section)
    onReportUpdate: publicProcedure.subscription(async function* ({ ctx, input, signal }) {
        // In this example we use a simple event emitter.
        // Make sure you import the Node EventEmitter from 'events' in your server code.
        const listener = (updatedReport: any) => {
            // Optionally filter for the current user, etc.
            // For now we yield every update.
            iterator.push(updatedReport);
        };

        const iterator: any[] = [];
        reportEmitter.on("reportUpdated", listener);

        try {
            while (!signal.aborted) {
                // Wait for new updates (e.g., poll every 500ms)
                await new Promise((resolve) => setTimeout(resolve, 500));
                while (iterator.length) {
                    yield iterator.shift();
                }
            }
        } finally {
            reportEmitter.off("reportUpdated", listener);
        }
    }),

    // Retrieve all reports for the user.
    getByUserId: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
            return db.report.findMany({
                where: {
                    userId: input.userId,
                },
                orderBy: { createdAt: "desc" },
            });
        }),

    // Get a single report by ID for the specified user
    getById: publicProcedure
        .input(
            z.object({
                id: z.string(),
                userId: z.string(),
            })
        )
        .query(async ({ input }) => {
            return db.report.findFirst({
                where: {
                    id: input.id,
                    userId: input.userId,
                },
            });
        }),

    // Update an existing report.
    update: publicProcedure
        .input(
            z.object({
                id: z.string(),
                userId: z.string(),
                repoUrl: z.string().url().optional(),
                content: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            return db.report.updateMany({
                where: {
                    id: input.id,
                    userId: input.userId,
                },
                data: {
                    repoUrl: input.repoUrl,
                    content: input.content,
                },
            });
        }),

});
