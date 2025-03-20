// src/lib/github/visualization/assignDFSIndices.ts
import type { RepoTreeNode } from "./formatTree";

export type DFSRepoTreeNode = RepoTreeNode & { dfsIndex: number };

export function assignDFSIndices(tree: RepoTreeNode[]): DFSRepoTreeNode[] {
    let index = 0;
    function traverse(nodes: RepoTreeNode[]): DFSRepoTreeNode[] {
        return nodes.map((node) => {
            const currentIndex = index++;
            const newNode: DFSRepoTreeNode = { ...node, dfsIndex: currentIndex };
            if (node.children) {
                newNode.children = traverse(node.children);
            }
            return newNode;
        });
    }
    return traverse(tree);
}
