"use client";

import { useSearchParams } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { ReportForm } from "src/components/dashboard/new-report";
import { useRepoReport } from "~/hooks/useRepoReport";
import { FileExplorer } from "~/components/file-explorer";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";

export default function NewReportPage() {
    const searchParams = useSearchParams();
    const repoUrl = searchParams.get("repoUrl");

    // Assume useRepoReport returns title along with treeData.
    const { treeData, isLoading, error, title } = useRepoReport(repoUrl);

    return (
        <main className="container mx-auto flex h-[calc(100vh-4rem)]">
            {/* Left side: Report Form */}
            <div className="flex flex-1 flex-col items-center justify-center p-8">
                {isLoading ? (
                    <div className="w-full max-w-md space-y-6">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : repoUrl ? (
                    <ReportForm repoUrl={repoUrl} repoTree={treeData} />
                ) : (
                    <div className="w-full max-w-md">
                        <h1 className="text-4xl font-bold">New Report</h1>
                        <p>No repository URL provided.</p>
                    </div>
                )}
            </div>

            <Separator orientation="vertical" />

            {/* Right side: Repo tree preview */}
            {repoUrl ? (
                <div className="flex flex-1 flex-col items-start justify-start p-8 w-full h-full overflow-hidden">
                    {isLoading ? (
                        <div className="w-full h-[calc(100%-5rem)] flex flex-col items-center justify-center">
                            <Spinner size="lg" className="text-muted-foreground h-12 w-12 mb-4" />
                        </div>
                    ) : error ? (
                        <p className="text-destructive">Error loading repository structure</p>
                    ) : treeData && (
                        <div className="w-full h-[calc(100%-5rem)]">
                            <FileExplorer tree={treeData} title={title} delay={100} defaultExpanded={true} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-1 flex-col items-start justify-start p-8 w-full">
                    <h1 className="mb-8 text-3xl font-semibold">Repository Context Preview</h1>
                </div>
            )}
        </main>
    );
}
