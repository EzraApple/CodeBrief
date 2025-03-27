import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import { validateGitHubUrl, getTempFilePath } from "./utils";
import { extractRepoInfo} from "~/lib/github";
import { auth } from "~/lib/auth/auth";
import { db } from "~/server/db";
import {headers} from "next/headers";

const execAsync = promisify(exec);

export interface RepoMixOptions {
    style?: "xml" | "markdown" | "plain";
    compress?: boolean;
    outputFilePath?: string;
    remoteBranch?: string;
    // Additional options can be added here.
}

/**
 * Main function to generate the repomix output.
 * If isPrivate is false, it uses the public repo helper.
 * If isPrivate is true, it clones the repo locally (using an authenticated clone URL)
 * then runs repomix on the local clone.
 *
 * @param repoUrl - The GitHub repository URL.
 * @param options - Optional settings to customize the repomix command.
 * @param isPrivate - Whether the repository is private.
 * @returns A promise resolving to the generated output as a string.
 */
export async function generateRepoMixOutput(
    repoUrl: string,
    options: RepoMixOptions = {},
    isPrivate = false
): Promise<string> {
    if (!validateGitHubUrl(repoUrl)) {
        throw new Error("Invalid GitHub URL provided.");
    }

    if (isPrivate) {
        return generateRepoMixOutputForPrivateRepo(repoUrl, options);
    } else {
        return generateRepoMixOutputForPublicRepo(repoUrl, options);
    }
}

/**
 * Helper for processing a public repository.
 * Uses repomix's remote mode.
 */
async function generateRepoMixOutputForPublicRepo(
    repoUrl: string,
    options: RepoMixOptions = {}
): Promise<string> {
    const outputFilePath = options.outputFilePath ?? getTempFilePath();

    let command = `npx repomix --remote ${repoUrl} --output ${outputFilePath} --remove-comments`;
    command += options.style ? ` --style ${options.style}` : ` --style xml`;
    if (options.compress) command += ` --compress`;
    if (options.remoteBranch) command += ` --remote-branch ${options.remoteBranch}`;

    try {
        const { stdout, stderr } = await execAsync(command);
        console.log("repomix stdout:", stdout);
        console.log("repomix stderr:", stderr);
        const data = await fs.readFile(outputFilePath, { encoding: "utf8" });
        await fs.unlink(outputFilePath);
        return data;
    } catch (error) {
        throw new Error(`Error executing repomix command: ${error}`);
    }
}

/**
 * Helper for processing a private repository.
 * Clones the repository locally using an authenticated clone URL,
 * then runs repomix on the local clone, and cleans up afterward.
 */
async function generateRepoMixOutputForPrivateRepo(
    repoUrl: string,
    options: RepoMixOptions = {}
): Promise<string> {
    // Retrieve the GitHub access token from the user's session.
    let accessToken: string | undefined = undefined;
    const session = await auth.api.getSession({
        headers: await headers(), // Assumes you're in a server context with headers available
    });
    if (session && session.user && session.user.id) {
        const account = await db.account.findFirst({
            where: {
                userId: session.user.id,
            },
        });
        if (account && account.accessToken) {
            accessToken = account.accessToken;
            console.log("Using GitHub Access Token:", accessToken);
        } else {
            throw new Error("GitHub account not linked or access token is missing.");
        }
    } else {
        throw new Error("Private repository cloning requires a user session.");
    }

    // Extract owner and repo using your helper.
    const { owner, repo } = extractRepoInfo(repoUrl);
    // Construct an authenticated clone URL using the token.
    // Using the format: https://<token>:x-oauth-basic@github.com/owner/repo.git
    const cloneUrl = `https://${accessToken}:x-oauth-basic@github.com/${owner}/${repo}.git`;
    console.log("Authenticated clone URL:", cloneUrl);

    // Create a temporary directory to clone the repository.
    const tempRepoPath = getTempFilePath();
    await fs.mkdir(tempRepoPath, { recursive: true });

    // Clone the repository into the temporary directory.
    const cloneCommand = `git clone ${cloneUrl} ${tempRepoPath}`;
    try {
        const { stdout, stderr } = await execAsync(cloneCommand);
        console.log("Clone stdout:", stdout);
        console.log("Clone stderr:", stderr);
    } catch (error) {
        throw new Error(`Error cloning repository: ${error}`);
    }

    // Use a temporary file for repomix output if not provided.
    const outputFilePath = options.outputFilePath ?? getTempFilePath();

    // Build the repomix command for the local clone.
    // Do not use --remote flag when processing a local directory.
    let command = `npx repomix ${tempRepoPath} --output ${outputFilePath} --remove-comments`;
    command += options.style ? ` --style ${options.style}` : ` --style xml`;
    if (options.compress) command += ` --compress`;
    if (options.remoteBranch) command += ` --remote-branch ${options.remoteBranch}`;

    try {
        const { stdout, stderr } = await execAsync(command);
        console.log("repomix (local) stdout:", stdout);
        console.log("repomix (local) stderr:", stderr);

        const data = await fs.readFile(outputFilePath, { encoding: "utf8" });
        await fs.unlink(outputFilePath);
        return data;
    } catch (error) {
        throw new Error(`Error executing repomix on local clone: ${error}`);
    } finally {
        // Cleanup: remove the cloned repository directory.
        await fs.rm(tempRepoPath, { recursive: true, force: true });
    }
}
