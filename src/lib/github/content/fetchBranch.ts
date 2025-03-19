// lib/github/contents/fetchBranch.ts

import type { GitBranch } from "../types";

/**
 * Fetches branch data from GitHub for a given branch.
 *
 * @param baseUrl - The base GitHub API URL for the repository.
 * @param branch - The branch name (default is "main").
 * @returns A promise that resolves to the GitBranch data.
 */
export async function fetchBranch(
    baseUrl: string,
    branch: string = "main"
): Promise<GitBranch> {
    const url = `${baseUrl}/branches/${branch}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch branch info: ${res.statusText}`);
    }
    const data: GitBranch = await res.json();
    return data;
}
