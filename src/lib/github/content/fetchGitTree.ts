// lib/github/contents/fetchGitTree.ts

import type { GitTreeResponse } from "../types";

/**
 * Fetches the Git tree for a repository.
 *
 * @param baseUrl - The base GitHub API URL for the repo (e.g., "https://api.github.com/repos/owner/repo")
 * @param treeSha - The SHA of the tree to fetch (for the root tree, you can get this from the repo data)
 * @param recursive - Whether to fetch recursively (default false)
 * @returns A GitTreeResponse containing the tree array.
 */
export async function fetchGitTree(
    baseUrl: string,
    treeSha: string,
    recursive = false
): Promise<GitTreeResponse> {
    const url = `${baseUrl}/git/trees/${treeSha}${recursive ? "?recursive=1" : ""}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch git tree: ${res.statusText}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await res.json();
}
