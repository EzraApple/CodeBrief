"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { ReportForm, RepoInput } from "src/components/dashboard/new-report";
import { useRepoReport } from "~/hooks/useRepoReport";
import { FileExplorer } from "~/components/file-explorer";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";

function NewReportContent() {
    const searchParams = useSearchParams();
    const initialRepoUrl = searchParams.get("repoUrl");

    // State to track the locked repository URL and description
    const [repoUrl, setRepoUrl] = useState<string | null>(initialRepoUrl);
    const [repoDescription, setRepoDescription] = useState<string>("");
    const [isRepoPrivate, setIsRepoPrivate] = useState<boolean>(false);

    // Assume useRepoReport returns title along with treeData.
    const { treeData, isLoading, error, title } = useRepoReport(repoUrl);

    // Handler for when a URL is locked in the RepoInput component
    const handleUrlLocked = (url: string, description: string, isPrivate: boolean) => {
        setRepoUrl(url);
        setRepoDescription(description);
        setIsRepoPrivate(isPrivate);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                duration: 0.5,
            },
        },
    };

    const rightSideVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 20,
                duration: 0.7,
                delay: 0.2,
            },
        },
        exit: {
            opacity: 0,
            x: 100,
            transition: {
                duration: 0.3,
            },
        },
    };

    // Left side container width changes based on whether the repo is selected.
    const leftSideClass = repoUrl
        ? "flex flex-1 flex-col items-center justify-center p-8"
        : "flex flex-1 flex-col items-center justify-center p-8 max-w-3xl mx-auto";

    return (
        <motion.main
            className="container mx-auto flex h-[calc(100vh-4rem)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Left side: Report Form */}
            <motion.div className={leftSideClass} variants={itemVariants} layout>
                {isLoading ? (
                    <div className="w-full max-w-md space-y-6">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : repoUrl ? (
                    <ReportForm
                        repoUrl={repoUrl}
                        repoTree={treeData}
                        repoDescription={repoDescription}
                        isPrivate={isRepoPrivate}
                    />
                ) : (
                    <RepoInput initialRepoUrl={initialRepoUrl} onUrlLocked={handleUrlLocked} />
                )}
            </motion.div>

            <AnimatePresence>
                {/* Only show separator and right side when repo is provided */}
                {repoUrl && (
                    <>
                        <Separator orientation="vertical" />
                        {/* Right side: Repo tree preview with slide animation */}
                        <motion.div
                            className="flex flex-1 flex-col items-start justify-start p-8 w-full h-full overflow-hidden"
                            variants={rightSideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                        >
                            {isLoading ? (
                                <div className="w-full h-[calc(100%-5rem)] flex flex-col items-center justify-center">
                                    <Spinner size="lg" className="text-muted-foreground h-12 w-12 mb-4" />
                                </div>
                            ) : error ? (
                                <p className="text-destructive">Error loading repository structure</p>
                            ) : treeData ? (
                                <div className="w-full h-[calc(100%-5rem)]">
                                    <FileExplorer tree={treeData} title={title} delay={100} defaultExpanded={true} />
                                </div>
                            ) : null}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.main>
    );
}

export default function NewReportPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewReportContent />
        </Suspense>
    );
}
