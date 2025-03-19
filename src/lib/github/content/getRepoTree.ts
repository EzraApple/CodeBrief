import { getDirectoryContents } from "~/lib/github";

export type RepoTreeNode = {
    name: string;
    type: "file" | "dir";
    children?: RepoTreeNode[];
};

/**
 * Recursively builds a file tree structure.
 *
 * @param baseUrl - The base GitHub API URL (e.g., "https://api.github.com/repos/owner/repo")
 * @param path - The directory path to start from (empty string for root).
 * @param depth - Optional. How deep to traverse. If provided (e.g., 1 = current directory only),
 *                if omitted, the function will recursively fetch the entire tree.
 * @returns An array of RepoTreeNode representing the file/directory structure.
 */
export async function getRepoTree(
    baseUrl: string,
    path = "",
    depth?: number
): Promise<RepoTreeNode[]> {
    const contents = await getDirectoryContents(baseUrl, path);
    const tree: RepoTreeNode[] = [];

    for (const item of contents) {
        const node: RepoTreeNode = {
            name: item.name,
            type: item.type,
        };

        if (item.type === "dir" && (depth === undefined || depth > 1)) {
            const newPath = path ? `${path}/${item.name}` : item.name;
            const newDepth = depth === undefined ? undefined : depth - 1;
            node.children = await getRepoTree(baseUrl, newPath, newDepth);
        }

        tree.push(node);
    }

    return tree;
}
