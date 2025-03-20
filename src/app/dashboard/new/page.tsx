"use client";

import { useSearchParams } from "next/navigation";
import { useRepoReport } from "~/hooks/useRepoReport";
import { FileExplorer } from "~/components/file-explorer";

export default function NewReportPage() {
    const searchParams = useSearchParams();
    const repoUrl = searchParams.get("repoUrl");

    const { treeData, isLoading, error } = useRepoReport(repoUrl, 5);

    if (!repoUrl) {
        return (
            <main className="p-4">
                <h1 className="text-4xl font-bold">New Report</h1>
                <p>No repository URL provided.</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Repository Structure</h1>
            {isLoading && <p>Loading repository structure...</p>}
            {error && <p className="text-destructive">Error: {error.message}</p>}
            {treeData && (
                <div className="mt-4">
                    <FileExplorer tree={treeData} delay={300} defaultExpanded={true} />
                </div>
            )}
        </main>
    );
}
