"use client";

import { useState, useEffect } from "react";
import { useSession } from "~/lib/auth/auth-client";
import { api } from "~/trpc/react";
import { NewReportDialog } from "~/components/dashboard/new-report-dialog";
import { ReportList } from "~/components/dashboard/report-list";
import { ReportListLoading } from "~/components/dashboard/report-list-loading";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";

interface Report {
    id: string;
    repoUrl: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    repoContextId: string | null;
    modelResponse: string | null;
    status: string;
    repoDescription?: string;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id ?? "";
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    // Check if user is coming from the new report page
    useEffect(() => {
        if (searchParams.get("fromNewReport") === "true") {
            // Show toast notification
            toast({
                title: "Report Added",
                description: "Your report has been added to the pending list.",
                duration: 5000,
            });
            
            // Clear the query parameter
            router.replace("/dashboard");
        }
    }, [searchParams, toast, router]);

    // Load view mode from localStorage on mount
    useEffect(() => {
        const savedViewMode = localStorage.getItem("reportListViewMode");
        if (savedViewMode === "grid" || savedViewMode === "list") {
            setViewMode(savedViewMode);
        }
    }, []);

    // Poll the reports query every 5000ms (5 seconds)
    const { data: reports, isLoading } = api.report.getByUserId.useQuery(
        { userId: session?.user?.id ?? "" },
        { enabled: Boolean(session?.user?.id), refetchInterval: 5000 }
    );

    // Split reports into pending (queue) and completed (library)
    const completedReports = (reports as Report[] ?? []).filter(r => r.status === "complete");
    const pendingReports = (reports as Report[] ?? []).filter(r => r.status !== "complete");

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.1 }
        }
    };

    return (
        <motion.main 
            className="container mx-auto p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                {isLoading ? (
                    <ReportListLoading viewMode={viewMode} />
                ) : (
                    <ReportList 
                        reports={completedReports} 
                        pendingReports={pendingReports}
                        onNewReport={() => setDialogOpen(true)}
                        onViewModeChange={setViewMode}
                        defaultViewMode={viewMode}
                        userId={userId}
                    />
                )}
            </motion.div>

            <NewReportDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </motion.main>
    );
}
