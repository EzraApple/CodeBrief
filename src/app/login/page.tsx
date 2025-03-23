"use client";

import { useSearchParams } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { LoginBox } from "~/components/auth/login-box";
import { useRepoReport } from "~/hooks/useRepoReport";
import { FileExplorer } from "~/components/file-explorer";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const repoUrl = searchParams.get("repoUrl") ?? null;

    // useRepoReport now returns a title along with treeData.
    const { treeData, isLoading, error, title } = useRepoReport(repoUrl);

    if (!repoUrl) {
        return (
            <main className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center">
                <LoginBox repoUrl={repoUrl} />
            </main>
        );
    }

    return (
        <main className="container mx-auto flex h-[calc(100vh-4rem)]">
            {/* Left side: Login UI */}
            <div className="flex flex-1 flex-col items-center justify-center p-8">
                <LoginBox repoUrl={repoUrl} />
            </div>

            <Separator orientation="vertical" />

            {/* Repo Preview Side */}
            <div className="flex flex-1 flex-col items-start justify-start p-8 w-full h-full overflow-hidden">
                {isLoading && <p>Loading repository structure...</p>}
                {error && (
                    <p className="text-destructive">Error: {error.message}</p>
                )}
                {treeData && (
                    <div className="w-full h-[calc(100%-5rem)]">
                        <FileExplorer tree={treeData} title={title} delay={100} defaultExpanded={true} />
                    </div>
                )}
            </div>
        </main>
    );
}
