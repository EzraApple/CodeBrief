// src/lib/github/visualization/getLanguageBreakdown.ts

import type { RepoTreeNode } from "./formatTree";
import { inferLanguage } from "./inferLanguage";

export type LanguageBreakdown = {
    language: string;
    percentage: number;
    color: string;
};

function calculateLanguageCounts(tree: RepoTreeNode[]): Record<string, { count: number; color: string }> {
    const counts: Record<string, { count: number; color: string }> = {};

    function traverse(nodes: RepoTreeNode[]) {
        nodes.forEach((node) => {
            if (node.type === "file") {
                const detail = inferLanguage(node.name);
                if (detail) {
                    if (!counts[detail.language]) {
                        counts[detail.language] = { count: 0, color: detail.color };
                    }
                    counts[detail.language].count++;
                }
            } else if (node.type === "dir" && node.children) {
                traverse(node.children);
            }
        });
    }

    traverse(tree);
    return counts;
}

export function calculateLanguageBreakdown(tree: RepoTreeNode[]): LanguageBreakdown[] {
    const counts = calculateLanguageCounts(tree);
    const total = Object.values(counts).reduce((sum, item) => sum + item.count, 0);
    const breakdown: LanguageBreakdown[] = [];

    for (const language in counts) {
        const { count, color } = counts[language];
        breakdown.push({
            language,
            percentage: total > 0 ? (count / total) * 100 : 0,
            color,
        });
    }
    return breakdown;
}
