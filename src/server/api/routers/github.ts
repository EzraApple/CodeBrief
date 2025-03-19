import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { extractRepoInfo, generateBaseApiUrl } from "~/lib/github/url";
import { fetchBranch } from "~/lib/github/content/fetchBranch";
import { fetchGitTree } from "~/lib/github/content/fetchGitTree";
import { buildRepoTree } from "~/lib/github/content/buildRepoTree";
import { formatRepoTreeToMarkdown } from "~/lib/github/visualization/formatTree";

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
});
