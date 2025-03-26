"use client";

import { useSearchParams } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { ReportForm } from "src/components/dashboard/new-report";
import { useRepoReport } from "~/hooks/useRepoReport";
import { FileExplorer } from "~/components/file-explorer";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { LockIcon, UnlockIcon } from "lucide-react";
import { Label } from "~/components/ui/label";

export default function NewReportPage() {
    const searchParams = useSearchParams();
    const initialRepoUrl = searchParams.get("repoUrl");
    
    const [customRepoUrl, setCustomRepoUrl] = useState("");
    const [isUrlLocked, setIsUrlLocked] = useState(false);
    const [isUrlValid, setIsUrlValid] = useState(false);
    
    // Use initial URL from search params or the locked custom URL
    const repoUrl = initialRepoUrl || (isUrlLocked ? customRepoUrl : null);

    // Assume useRepoReport returns title along with treeData.
    const { treeData, isLoading, error, title } = useRepoReport(repoUrl);
    
    // Validate URL format when customRepoUrl changes
    useEffect(() => {
        try {
            // Simple validation - check if it's a properly formatted URL
            // Could add more specific GitHub repo validation if needed
            new URL(customRepoUrl);
            setIsUrlValid(customRepoUrl.trim().length > 0);
        } catch {
            setIsUrlValid(false);
        }
    }, [customRepoUrl]);
    
    // Handle URL lock/unlock toggle
    const handleToggleUrlLock = () => {
        if (!isUrlLocked && !isUrlValid) {
            // Don't allow locking with invalid URL
            return;
        }
        setIsUrlLocked(!isUrlLocked);
    };

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
                    <div className="w-full max-w-md space-y-6">
                        <h1 className="text-4xl font-bold">New Report</h1>
                        <p className="text-muted-foreground mb-6">Enter a GitHub repository URL to generate a report.</p>
                        
                        <div className="space-y-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="repoUrl">Repository URL</Label>
                                <div className="flex w-full items-center space-x-2">
                                    <Input
                                        id="repoUrl"
                                        type="text"
                                        placeholder="https://github.com/username/repo"
                                        value={customRepoUrl}
                                        onChange={(e) => setCustomRepoUrl(e.target.value)}
                                        disabled={isUrlLocked}
                                        className="flex-1"
                                    />
                                    <div className="flex items-center space-x-2" onClick={handleToggleUrlLock}>
                                        <Switch 
                                            checked={isUrlLocked} 
                                            disabled={!isUrlValid && !isUrlLocked}
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            type="button"
                                            disabled={!isUrlValid && !isUrlLocked}
                                        >
                                            {isUrlLocked ? 
                                                <LockIcon className="h-4 w-4" /> : 
                                                <UnlockIcon className="h-4 w-4" />
                                            }
                                        </Button>
                                    </div>
                                </div>
                                {!isUrlValid && customRepoUrl.length > 0 && (
                                    <p className="text-sm text-destructive">Please enter a valid URL</p>
                                )}
                                {!isUrlLocked && (
                                    <p className="text-sm text-muted-foreground">Lock the URL to start generating a report</p>
                                )}
                            </div>
                        </div>
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
                    <p className="text-muted-foreground">Enter and lock a repository URL to see the file structure here.</p>
                </div>
            )}
        </main>
    );
}
