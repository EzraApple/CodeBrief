// lib/github/url.ts

export interface GitHubRepoInfo {
    owner: string;
    repo: string;
}

/**
 * Extracts the owner and repository name from a GitHub URL.
 * Example: "https://github.com/owner/repo" or "https://github.com/owner/repo.git"
 *
 * @param url - The GitHub repository URL.
 * @returns An object containing the repository owner and name.
 * @throws Error if the URL does not match the expected GitHub URL pattern.
 */
export function extractRepoInfo(url: string): GitHubRepoInfo {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/;
    const match = regex.exec(url);
    if (!match) {
        throw new Error("Invalid GitHub URL. Ensure it includes the owner and repository name.");
    }
    // Remove .git suffix if present
    const repo = match[2].replace(/\.git$/, "");
    return {
        owner: match[1],
        repo,
    };
}

/**
 * Generates the base GitHub API URL for a given repository.
 * Example output: "https://api.github.com/repos/owner/repo"
 *
 * @param info - The GitHub repository info object.
 * @returns The base API URL.
 */
export function generateBaseApiUrl(info: GitHubRepoInfo): string {
    return `https://api.github.com/repos/${info.owner}/${info.repo}`;
}

/**
 * Builds a full GitHub API URL by appending an endpoint and optional query parameters.
 * For example, to get the repository contents you might call:
 * buildFullApiUrl(info, '/contents', { ref: 'main' })
 *
 * @param info - The GitHub repository info object.
 * @param endpoint - An endpoint to append (default is empty string).
 * @param queryParams - Optional object containing query parameters.
 * @returns The complete GitHub API URL.
 */
export function buildFullApiUrl(
    info: GitHubRepoInfo,
    endpoint = "",
    queryParams?: Record<string, string | number | boolean>
): string {
    const baseUrl = generateBaseApiUrl(info);
    let url = `${baseUrl}${endpoint}`;

    if (queryParams && Object.keys(queryParams).length > 0) {
        const queryString = Object.entries(queryParams)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
            )
            .join("&");
        url += `?${queryString}`;
    }

    return url;
}
