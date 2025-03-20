"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import type { RepoTreeNode } from "~/lib/github/visualization/formatTree";
import { useSession } from "~/lib/auth/auth-client";
import { extractRepoInfo } from "~/lib/github/url";

export type UseRepoReportReturn = {
    treeData: RepoTreeNode[] | null;
    isLoading: boolean;
    error: unknown;
    title: string;
};

export function useRepoReport(repoUrl: string | null): UseRepoReportReturn {
    const session = useSession();
    const userId = session?.data?.session?.userId || undefined;
    const [treeData, setTreeData] = useState<RepoTreeNode[] | null>(null);
    const [title, setTitle] = useState("");
    const hasSetTreeRef = useRef(false);

    // Compute a title (e.g. "owner / repo") from the repoUrl.
    useEffect(() => {
        if (repoUrl) {
            try {
                const info = extractRepoInfo(repoUrl);
                setTitle(`${info.owner} / ${info.repo}`);
            } catch (err) {
                console.error("Error extracting repo info:", err);
                setTitle("");
            }
        }
    }, [repoUrl]);

    const { data, isLoading, error } = api.github.getRepoTreeCached.useQuery(
        { repoUrl: repoUrl || "", userId },
        {
            enabled: Boolean(repoUrl),
            onSuccess: (result) => {
                if (result?.treeData && !hasSetTreeRef.current) {
                    setTreeData(result.treeData);
                    hasSetTreeRef.current = true;
                }
            },
        }
    );

    const finalTreeData = (treeData ?? data?.treeData) ?? null;

    return { treeData: finalTreeData, isLoading, error, title };
}
