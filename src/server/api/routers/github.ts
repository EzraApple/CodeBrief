import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { extractRepoInfo, generateBaseApiUrl } from "~/lib/github/url";
import { fetchBranch } from "~/lib/github/content/fetchBranch";
import { fetchGitTree } from "~/lib/github/content/fetchGitTree";
import { buildRepoTree } from "~/lib/github/content/buildRepoTree";
import { formatRepoTreeToMarkdown } from "~/lib/github/visualization/formatTree";
import { db } from "~/server/db";
import {RepoTreeNode} from "~/lib/github";
import { getRepoDescription } from "~/lib/github/content/getRepoDescription";
import {auth} from "~/lib/auth/auth";
import {headers} from "next/headers";

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
                return { id: existing.id, repoUrl: input.repoUrl, treeData: existing.treeData };
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
                return { id: newRepoTree.id, repoUrl: input.repoUrl, treeData: nestedTree };
            }

            return { treeData: nestedTree };
        }),

    
        getRepoDescription: publicProcedure
        .input(
          z.object({
            repoUrl: z.string().url(),
          })
        )
        .query(async ({ input }) => {
          const description = await getRepoDescription(input.repoUrl);
          // Return the description as a string (empty string if null)
          return description || "";
        }),

        getUserRepos: publicProcedure.query(async () => {
            // Retrieve the session using the headers from the incoming request.
            const session = await auth.api.getSession({
                headers: await headers(),
            });

            // Ensure the session is available and has a user ID.
            if (!session || !session.user || !session.user.id) {
                throw new Error("User is not authenticated");
            }

            // Query your database for the GitHub account associated with this user.
            // Adjust the table/field names according to your Better Auth setup.
            const account = await db.account.findFirst({
                where: {
                    userId: session.user.id,
                },
            });
            console.log(account)

            if (!account || !account.accessToken) {
                throw new Error("GitHub account not linked or access token is missing");
            }

            const accessToken = account.accessToken;
            console.log("Retrieved GitHub Access Token:", accessToken);

            // Make a request to GitHub's API to fetch the user's repositories.
            const response = await fetch("https://api.github.com/user/repos?per_page=100&visibility=all&affiliation=owner", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Accept": "application/vnd.github+json",
                },
            });
            console.log("\n\n\n\n\n", response.headers)

            if (!response.ok) {
                throw new Error(`Failed to fetch repositories: ${response.statusText}`);
            }

            const repos = await response.json();
            return repos;
        }),

});
