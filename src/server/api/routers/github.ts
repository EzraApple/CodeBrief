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

            // Retrieve accessToken early from the session/account.
            let accessToken: string | undefined = undefined;
            const session = await auth.api.getSession({
                headers: await headers(),
            });
            if (session && session.user && session.user.id) {
                // Query the database for the GitHub account linked to this user.
                const account = await db.account.findFirst({
                    where: {
                        userId: session.user.id,
                    },
                });
                if (account && account.accessToken) {
                    accessToken = account.accessToken;
                    console.log("Using GitHub Access Token:", accessToken);
                } else {
                    console.log("No GitHub account linked or access token missing.");
                }
            } else {
                console.log("No user session found; proceeding without Authorization header.");
            }

            // Fetch from GitHub.
            const repoInfo = extractRepoInfo(input.repoUrl);
            const baseUrl = generateBaseApiUrl(repoInfo);

            // Fetch branch data using the access token if available.
            const branchData = await fetchBranch(baseUrl, "main", accessToken);
            const treeSha = branchData.commit.commit.tree.sha;

            // Fetch the Git tree using the access token if available.
            const treeResponse = await fetchGitTree(baseUrl, treeSha, true, accessToken);
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
            if (!session?.user?.id) {
                throw new Error("User is not authenticated");
            }

            // Query your database for the GitHub account associated with this user.
            // Adjust the table/field names according to your Better Auth setup.
            const account = await db.account.findFirst({
                where: {
                    userId: session.user.id,
                },
            });

            if (!account?.accessToken) {
                throw new Error("GitHub account not linked or access token is missing");
            }

            const accessToken = account.accessToken;
            console.log("Retrieved GitHub Access Token:", accessToken);

            // Make a request to GitHub's API to fetch the user's repositories.
            const response = await fetch("https://api.github.com/user/repos?per_page=100&visibility=all", {
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

    getRepoInfo: publicProcedure
        .input(
            z.object({
                repoUrl: z.string().url(),
            })
        )
        .query(async ({ input }) => {
            // Extract owner and repository name from the URL.
            const { owner, repo } = extractRepoInfo(input.repoUrl);
            const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

            console.log("Received repo URL:", input.repoUrl);
            console.log("Generated API URL:", apiUrl);

            // Build base headers.
            const headersObj: Record<string, string> = {
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            };

            // Attempt to get the session from the incoming request headers.
            const session = await auth.api.getSession({
                headers: await headers(),
            });

            // If a session exists, query the database for the GitHub account and add its access token.
            if (session && session.user && session.user.id) {
                const account = await db.account.findFirst({
                    where: {
                        userId: session.user.id,
                    },
                });
                if (account && account.accessToken) {
                    headersObj.Authorization = `Bearer ${account.accessToken}`;
                    console.log("Using GitHub Access Token from account:", account.accessToken);
                } else {
                    console.log("No GitHub account found or access token is missing.");
                }
            } else {
                console.log("No user session found; proceeding without an Authorization header.");
            }

            // Make the request to GitHub.
            const response = await fetch(apiUrl, { headers: headersObj });

            if (response.status === 404) {
                return "repo not found";
            }

            if (!response.ok) {
                throw new Error(`GitHub API returned error: ${response.statusText}`);
            }

            const repoData = await response.json();
            return repoData;
        }),
});
