import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import { validateGitHubUrl, getTempFilePath } from './utils';

const execAsync = promisify(exec);

export interface RepoMixOptions {
    style?: 'xml' | 'markdown' | 'plain';
    compress?: boolean;
    outputFilePath?: string;
    remoteBranch?: string;
    // Additional options (e.g., include/ignore patterns) can be added here
}

/**
 * Generate the Repomix output for a given GitHub repository URL.
 * It builds a custom repomix CLI command with key settings and returns
 * the output file content.
 *
 * @param repoUrl - The public GitHub repository URL.
 * @param options - Optional settings to customize the repomix command.
 * @returns A promise resolving to the generated output as a string.
 */
export async function generateRepoMixOutput(
    repoUrl: string,
    options: RepoMixOptions = {}
): Promise<string> {
    // Validate the GitHub URL
    if (!validateGitHubUrl(repoUrl)) {
        throw new Error('Invalid GitHub URL provided.');
    }

    // Determine the output file path, defaulting to a temporary file if none provided
    const outputFilePath = options.outputFilePath ?? getTempFilePath();

    // Build the repomix command with the desired options
    // Use the --remote flag for processing a remote GitHub repository
    let command = `npx repomix --remote ${repoUrl} --output ${outputFilePath}`;

    // Set the output style (default to XML if not specified)
    if (options.style) {
        command += ` --style ${options.style}`;
    } else {
        command += ` --style xml`;
    }

    // Add the compress flag if enabled
    if (options.compress) {
        command += ` --compress`;
    }

    // Add a remote branch if provided (e.g., for specific branch, tag, or commit hash)
    if (options.remoteBranch) {
        command += ` --remote-branch ${options.remoteBranch}`;
    }

    // Execute the repomix CLI command
    try {
        const { stdout, stderr } = await execAsync(command);

        // Optional: log stdout and stderr if you need to debug
        console.log(stdout, stderr);

        // Read the generated output file content
        const data = await fs.readFile(outputFilePath, { encoding: 'utf8' });

        // Optionally, clean up the temporary file after reading
        await fs.unlink(outputFilePath);

        return data;
    } catch (error) {
        throw new Error(`Error executing repomix command: ${error}`);
    }
}
