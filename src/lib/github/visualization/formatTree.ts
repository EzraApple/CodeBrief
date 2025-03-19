// lib/github/visualization/formatTree.ts

export type RepoTreeNode = {
    name: string;
    type: "file" | "dir";
    children?: RepoTreeNode[];
};

// Private recursive helper that builds the tree string.
function buildTreeMarkdown(
    tree: RepoTreeNode[],
    prefix = ""
): string {
    let md = "";
    tree.forEach((node, index) => {
        const isLast = index === tree.length - 1;
        const connector = isLast ? "└── " : "├── ";
        md += prefix + connector + node.name + "\n";
        if (node.children && node.children.length > 0) {
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            md += buildTreeMarkdown(node.children, newPrefix);
        }
    });
    return md;
}

/**
 * Generates an ASCII tree of the repository structure wrapped in a Markdown code block.
 *
 * @param tree - An array of repository tree nodes.
 * @returns A Markdown formatted string of the tree.
 *
 * Example output:
 * ```text
 * ├── file1
 * ├── file2
 * └── dir1
 *     ├── file3
 *     └── file4
 * ```
 */
export function formatRepoTreeToMarkdown(
    tree: RepoTreeNode[]
): string {
    const md = buildTreeMarkdown(tree);
    return "```text\n" + md + "\n```";
}
