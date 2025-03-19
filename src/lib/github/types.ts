// lib/github/types.ts

export type GitTreeNode = {
    path: string;
    mode: string;
    type: "blob" | "tree";
    sha: string;
    url: string;
};

export type GitTreeResponse = {
    sha: string;
    url: string;
    tree: GitTreeNode[];
    truncated: boolean;
};

export type GitBranch = {
    name: string;
    commit: {
        sha: string;
        commit: {
            tree: {
                sha: string;
            };
        };
    };
};

// The nested tree structure you use for visualization:
export type RepoTreeNode = {
    name: string;
    type: "file" | "dir";
    children?: RepoTreeNode[];
};
