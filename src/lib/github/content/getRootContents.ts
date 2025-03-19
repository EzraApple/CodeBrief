import type { GitHubContent } from "../types";

/**
 * Fetches the top-level contents of a repository.
 * @param baseUrl - The base GitHub API URL (e.g., "https://api.github.com/repos/owner/repo")
 * @returns An array of GitHubContent representing the root directory.
 */
export async function getRootContents(baseUrl: string): Promise<GitHubContent[]> {
    const url = `${baseUrl}/contents`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch root contents: ${res.statusText}`);
    }
    return await res.json();
}
