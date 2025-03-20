import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { extractRepoInfo, generateBaseApiUrl } from "~/lib/github/url";
import { fetchBranch } from "~/lib/github/content/fetchBranch";
import { fetchGitTree } from "~/lib/github/content/fetchGitTree";
import { buildRepoTree } from "~/lib/github/content/buildRepoTree";
import { formatRepoTreeToMarkdown } from "~/lib/github/visualization/formatTree";
import { db } from "~/server/db";

export const githubRouter = createTRPCRouter({
    getRepoTreeFormatted: publicProcedure
        .input(
            z.object({
                repoUrl: z.string().url(),
                depth: z.number().optional().default(2),
            })
        )
        .query(async ({ input }) => {
            // Extract repository info and build the base API URL.
            const repoInfo = extractRepoInfo(input.repoUrl);
            const baseUrl = generateBaseApiUrl(repoInfo);

            // Use the new function to fetch branch data.
            const branchData = await fetchBranch(baseUrl, "main");
            const treeSha = branchData.commit.commit.tree.sha;

            // Fetch the entire tree recursively.
            const treeResponse = await fetchGitTree(baseUrl, treeSha, true);

            // Build a nested tree up to the specified depth.
            const nestedTree = buildRepoTree(treeResponse.tree, input.depth);

            // Format the nested tree as Markdown.
            const markdown = formatRepoTreeToMarkdown(nestedTree);

            return { markdown };
        }),

    getRepoTree: publicProcedure
        .input(
            z.object({
                repoUrl: z.string().url(),
                depth: z.number().optional().default(5),
            })
        )
        .query(async ({ input }) => {
            // Check the cached repo tree first.
            const cached = await db.repoTree.findUnique({
                where: { repoUrl: input.repoUrl },
            });
            if (cached) {
                return cached.treeData as RepoTreeNode[];
            }
            // If no cache, fetch from GitHub.
            const repoInfo = extractRepoInfo(input.repoUrl);
            const baseUrl = generateBaseApiUrl(repoInfo);

            // Fetch branch info for the "main" branch (or use a dynamic default)
            const branchData = await fetchBranch(baseUrl, "main");
            const treeSha = branchData.commit.commit.tree.sha;

            // Fetch the entire tree recursively.
            const treeResponse = await fetchGitTree(baseUrl, treeSha, true);
            const nestedTree = buildRepoTree(treeResponse.tree, input.depth);
            return nestedTree;
        }),

    getRepoTreeCached: publicProcedure
        .input(
            z.object({
                repoUrl: z.string().url(),
                userId: z.string().optional(), // Provided only if user is logged in.
            })
        )
        .query(async ({ input }) => {
            // Check if the repo tree is already cached.
            const existing = await db.repoTree.findUnique({
                where: { repoUrl: input.repoUrl },
            });
            if (existing) {
                return { treeData: existing.treeData, id: existing.id };
            }
            // Otherwise, fetch from GitHub.
            const repoInfo = extractRepoInfo(input.repoUrl);
            const baseUrl = generateBaseApiUrl(repoInfo);
            // For simplicity, assume branch "main"
            const branchData = await fetchBranch(baseUrl, "main");
            const treeSha = branchData.commit.commit.tree.sha;
            const treeResponse = await fetchGitTree(baseUrl, treeSha, true);
            // Build the full nested tree (buildRepoTree is now updated to not require a depth limit).
            const nestedTree = buildRepoTree(treeResponse.tree);
            // Only write to the DB if a userId is provided.
            if (input.userId) {
                const newRepoTree = await db.repoTree.create({
                    data: {
                        repoUrl: input.repoUrl,
                        treeData: nestedTree,
                    },
                });
                return { treeData: nestedTree, id: newRepoTree.id };
            }
            return { treeData: nestedTree };
        }),

});
