import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import { getTempFilePath } from './utils';

const execAsync = promisify(exec);

/**
 * Clones the provided GitHub repository URL into a temporary directory.
 *
 * @param repoUrl - The GitHub repository URL to clone.
 * @returns A promise that resolves to the path of the cloned repository.
 */
export async function cloneRepositoryTemporarily(repoUrl: string): Promise<string> {
    // Generate a temporary directory path.
    const tempRepoPath = getTempFilePath();

    // Create the directory.
    await fs.mkdir(tempRepoPath, { recursive: true });

    // Build and execute the git clone command.
    const cloneCommand = `git clone ${repoUrl} ${tempRepoPath}`;
    try {
        const { stdout, stderr } = await execAsync(cloneCommand);
        console.log("Clone stdout:", stdout);
        console.log("Clone stderr:", stderr);
    } catch (error) {
        throw new Error(`Error cloning repository: ${error}`);
    }

    return tempRepoPath;
}
