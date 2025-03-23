// lib/github/contents/buildRepoTree.ts

import type { GitTreeNode, RepoTreeNode } from "../types";

/**
 * Builds a nested repository tree structure from a flat array of Git tree nodes.
 *
 * @param flatNodes - The flat array of GitTreeNode objects.
 * @param maxDepth - Maximum depth to include (1 = only root level)
 * @returns A nested array of RepoTreeNode.
 */
export function buildRepoTree(
    flatNodes: GitTreeNode[],
    maxDepth: number | null
): RepoTreeNode[] {
    // Create a root container
    const root: RepoTreeNode = { name: "", type: "dir", children: [] };

    for (const node of flatNodes) {
        // Split path into parts (directories/files)
        const parts = node.path.split("/");
        // Limit depth if necessary
        if (maxDepth !== null && maxDepth > 0 && parts.length > maxDepth) {
            parts.splice(maxDepth);
        }
        let current = root;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!current.children) {
                current.children = [];
            }
            let child = current.children.find(c => c.name === part);
            if (!child) {
                child = {
                    name: part,
                    // For the last segment, use the type from the GitTreeNode.
                    type: i === parts.length - 1 ? (node.type === "blob" ? "file" : "dir") : "dir",
                    children: [],
                };
                current.children.push(child);
            }
            current = child;
        }
    }

    return root.children ?? [];
}
