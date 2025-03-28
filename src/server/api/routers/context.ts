import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generateRepoMixOutput } from "~/lib/context/repomix";
import { db } from "~/server/db";

export const repoContextRouter = createTRPCRouter({
    // Mutation to generate and store a repomix context for a given repository URL.
    generateRepoContext: publicProcedure
        .input(
            z.object({
                repoUrl: z.string().url(),
                // Optional userId to attach the context to a user (e.g., if the user is logged in)
                userId: z.string().optional(),
                // Optionally allow the caller to override the default output style and compression
                style: z.enum(["xml", "markdown", "plain"]).optional().default("xml"),
                compress: z.boolean().optional().default(false),
                isPrivate: z.boolean()
            })
        )
        .mutation(async ({ input }) => {
            // Generate the context using the repomix CLI wrapper with preset options.
            const context = await generateRepoMixOutput(input.repoUrl, {
                style: input.style,
                compress: input.compress,
            }, input.isPrivate);

            // Save the generated context to the RepoContext table.
            const repoContext = await db.repoContext.create({
                data: {
                    repoUrl: input.repoUrl,
                    context,
                    userId: input.userId ?? null,
                },
            });

            return repoContext;
        }),

    // Query to fetch an existing repo context by repository URL (and optionally, by userId).
    getRepoContext: publicProcedure
        .input(
            z.object({
                repoUrl: z.string().url(),
                userId: z.string().optional(),
            })
        )
        .query(async ({ input }) => {
            const repoContext = await db.repoContext.findFirst({
                where: {
                    repoUrl: input.repoUrl,
                    ...(input.userId ? { userId: input.userId } : {}),
                },
                orderBy: { createdAt: "desc" },
            });

            return repoContext;
        }),
});
