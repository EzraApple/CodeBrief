// lib/github/contents/getFileContentFromBlob.ts

/**
 * Fetches file content using the Git Blob API.
 *
 * @param baseUrl - The base GitHub API URL for the repo.
 * @param sha - The blob SHA for the file.
 * @returns The decoded file content as a string.
 */
export async function getFileContentFromBlob(
    baseUrl: string,
    sha: string
): Promise<string> {
    const url = `${baseUrl}/git/blobs/${sha}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch blob content: ${res.statusText}`);
    }
    const data = await res.json();
    if (data.encoding === "base64") {
        return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return data.content;
}
