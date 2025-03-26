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
    isPrivate: boolean;
}

export interface RepoInputProps {
    initialRepoUrl: string | null;
    onUrlLocked: (url: string, description: string, isPrivate: boolean) => void;
}

export interface GithubRepository {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    private: boolean;
}

