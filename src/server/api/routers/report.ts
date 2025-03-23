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
                repoDescription: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            return db.report.create({
                data: {
                    repoUrl: input.repoUrl,
                    userId: input.userId,
                    status: "pending",
                    repoDescription: input.repoDescription,
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
                content: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            console.log()
            return db.report.update({
                where: {
                    id: input.id,
                    userId: input.userId
                },
                data: {
                    modelResponse: input.content,
                },
            });
        }),

    // Delete a report from the database given a userID and report ID.
    delete: publicProcedure
        .input(
            z.object({
                id: z.string(),
                userId: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            // Using deleteMany in case the unique composite key is not defined
            return db.report.deleteMany({
                where: {
                    id: input.id,
                    userId: input.userId,
                },
            });
        }),


});
