import type { GitHubContent } from "../types";

/**
 * Fetches the contents of a directory.
 * @param baseUrl - The base GitHub API URL (e.g., "https://api.github.com/repos/owner/repo")
 * @param path - Optional: The directory path relative to the repo root. If omitted, fetches root contents.
 * @returns An array of GitHubContent representing the directory's contents.
 */
export async function getDirectoryContents(
    baseUrl: string,
    path?: string
): Promise<GitHubContent[]> {
    const endpoint = path ? `/contents/${encodeURIComponent(path)}` : "/contents";
    const url = `${baseUrl}${endpoint}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch directory contents for ${path ?? "root"}: ${res.statusText}`);
    }
    return await res.json();
}
