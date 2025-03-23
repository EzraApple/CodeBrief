export interface ReportSection {
    id: string;
    label: string;
    checked: boolean;
}

export type RepoTreeNode = {
    name: string;
    type: "file" | "dir";
    children?: RepoTreeNode[];
};

export interface RepoTree {
    id: string;
    repoUrl: string;
    treeData: RepoTreeNode;
}

export interface ReportFormProps {
    repoUrl: string;
    repoTree: RepoTreeNode[] | null;
    repoDescription?: string;
}

