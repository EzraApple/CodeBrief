// lib/github/contents/fetchBranch.ts

import type { GitBranch } from "../types";

/**
 * Fetches branch data from GitHub for a given branch.
 *
 * @param baseUrl - The base GitHub API URL for the repository.
 * @param branch - The branch name (default is "main").
 * @param accessToken - Optional GitHub OAuth access token for authenticated requests.
 * @returns A promise that resolves to the GitBranch data.
 */
export async function fetchBranch(
    baseUrl: string,
    branch: string = "main",
    accessToken?: string
): Promise<GitBranch> {
    const url = `${baseUrl}/branches/${branch}`;

    // Build headers and add Authorization if accessToken is provided.
    const headers: Record<string, string> = {
        "Accept": "application/vnd.github+json",
    };
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
        throw new Error(`Failed to fetch branch info: ${res.statusText}`);
    }
    const data: GitBranch = await res.json();
    return data;
}
