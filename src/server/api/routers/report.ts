// src/server/api/trpc/routers/report.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";

export const reportRouter = createTRPCRouter({
    // Create a new report for the user.
    create: publicProcedure
        .input(
            z.object({
                userId: z.string(),
                repoUrl: z.string().url(),
                content: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            return db.report.create({
                data: {
                    repoUrl: input.repoUrl,
                    content: input.content,
                    userId: input.userId,
                },
            });
        }),

    // Retrieve a report by its ID for the user.
    getById: publicProcedure
        .input(z.object({ id: z.string(), userId: z.string() }))
        .query(async ({ input }) => {
            return db.report.findFirst({
                where: {
                    id: input.id,
                    userId: input.userId,
                },
            });
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

    // Delete a report.
    delete: publicProcedure
        .input(z.object({ id: z.string(), userId: z.string() }))
        .mutation(async ({ input }) => {
            return db.report.deleteMany({
                where: {
                    id: input.id,
                    userId: input.userId,
                },
            });
        }),

    upsert: publicProcedure
        .input(
            z.object({
                userId: z.string(),
                repoUrl: z.string().url(),
            })
        )
        .mutation(async ({ input }) => {
            // Check if a report already exists for this user & repo.
            const existingReport = await db.report.findFirst({
                where: {
                    userId: input.userId,
                    repoUrl: input.repoUrl,
                },
            });
            if (existingReport) {
                return existingReport;
            }
            // Look up the RepoTree record.
            const repoTree = await db.repoTree.findUnique({
                where: { repoUrl: input.repoUrl },
            });
            if (!repoTree) {
                throw new Error("Repository tree not found in database. Please try again later.");
            }
            // Create a new report that links to the cached repo tree.
            return db.report.create({
                data: {
                    repoUrl: input.repoUrl,
                    userId: input.userId,
                    repoTreeId: repoTree.id,
                },
            });
        }),

    // Find a report by repoUrl for the user.
    findByRepoUrl: publicProcedure
        .input(
            z.object({
                userId: z.string(),
                repoUrl: z.string().url(),
            })
        )
        .query(async ({ input }) => {
            return db.report.findFirst({
                where: {
                    repoUrl: input.repoUrl,
                    userId: input.userId,
                },
            });
        }),
});
