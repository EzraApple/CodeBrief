// lib/github/contents/fetchGitTree.ts

import type { GitTreeResponse } from "../types";

/**
 * Fetches the Git tree for a repository.
 *
 * @param baseUrl - The base GitHub API URL for the repo (e.g., "https://api.github.com/repos/owner/repo")
 * @param treeSha - The SHA of the tree to fetch (for the root tree, you can get this from the repo data)
 * @param recursive - Whether to fetch recursively (default false)
 * @param accessToken - Optional GitHub OAuth access token to use for authenticated requests.
 * @returns A GitTreeResponse containing the tree array.
 */
export async function fetchGitTree(
    baseUrl: string,
    treeSha: string,
    recursive = false,
    accessToken?: string
): Promise<GitTreeResponse> {
    const url = `${baseUrl}/git/trees/${treeSha}${recursive ? "?recursive=1" : ""}`;

    // Build headers; include the Authorization header if accessToken is provided.
    const headers: Record<string, string> = {
        "Accept": "application/vnd.github+json",
    };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
        throw new Error(`Failed to fetch git tree: ${res.statusText}`);
    }
    return await res.json();
}

