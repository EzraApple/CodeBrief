import * as os from 'os';
import * as path from 'path';

/**
 * Validate that the provided URL is a valid public GitHub repository.
 * This uses a simple regex to ensure it matches GitHub URL patterns.
 *
 * @param url - The GitHub repository URL.
 * @returns true if valid; otherwise false.
 */
export function validateGitHubUrl(url: string): boolean {
    const regex = /^(https?:\/\/)?(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/;
    return regex.test(url);
}

/**
 * Generate a temporary file path in the OS temp directory.
 * You can pass in an extension (defaults to '.xml') for the generated file.
 *
 * @param extension - The file extension (e.g., ".xml").
 * @returns A full file path in the temporary directory.
 */
export function getTempFilePath(extension = '.xml'): string {
    const tempDir = os.tmpdir();
    const fileName = `repomix-output-${Date.now()}${extension}`;
    return path.join(tempDir, fileName);
}
