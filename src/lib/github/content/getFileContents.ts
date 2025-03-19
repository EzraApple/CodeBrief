import type { GitHubContent } from "../types";

/**
 * Fetches the contents of a specific file.
 * @param baseUrl - The base GitHub API URL (e.g., "https://api.github.com/repos/owner/repo")
 * @param path - The file path relative to the repo root.
 * @returns A GitHubContent object with file details and content.
 */
export async function getFileContents(
    baseUrl: string,
    path: string
): Promise<GitHubContent> {
    const url = `${baseUrl}/contents/${encodeURIComponent(path)}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch file contents for ${path}: ${res.statusText}`);
    }
    return await res.json();
}
