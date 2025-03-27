"use client";

import { useState, useEffect, useRef } from "react";
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
    const viewModeInitialized = useRef(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    
    // For optimistic updates
    const [optimisticPendingReports, setOptimisticPendingReports] = useState<Report[]>([]);
    const optimisticChecked = useRef(false);

    // Check for optimistic report in localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && !optimisticChecked.current) {
            const optimisticReport = localStorage.getItem('optimisticPendingReport');
            if (optimisticReport) {
                try {
                    const report = JSON.parse(optimisticReport) as Report;
                    if (report && report.userId === userId) {
                        setOptimisticPendingReports(prev => [...prev, report]);
                    }
                    // Remove from localStorage after reading it
                    localStorage.removeItem('optimisticPendingReport');
                } catch (e) {
                    console.error('Error parsing optimistic report', e);
                }
            }
            optimisticChecked.current = true;
        }
    }, [userId]);

    // Show toast notification for new report
    useEffect(() => {
        if (searchParams.get("fromNewReport") === "true") {
            toast({
                title: "Report Added",
                description: "Your report has been added to the pending list.",
                duration: 5000,
            });
            
            router.replace("/dashboard");
        }
    }, [searchParams, toast, router]);

    useEffect(() => {
        if (!viewModeInitialized.current && typeof window !== 'undefined') {
            const savedViewMode = localStorage.getItem("reportListViewMode");
            if (savedViewMode === "grid" || savedViewMode === "list") {
                setViewMode(savedViewMode);
            }
            viewModeInitialized.current = true;
        }
    }, []);

    useEffect(() => {
        if (viewModeInitialized.current && typeof window !== 'undefined') {
            localStorage.setItem("reportListViewMode", viewMode);
        }
    }, [viewMode]);

    const { data: reports, isLoading } = api.report.getByUserId.useQuery(
        { userId: session?.user?.id ?? "" },
        { enabled: Boolean(session?.user?.id), refetchInterval: 5000 }
    );

    // Split reports into pending (queue) and completed (library)
    // Include optimistic pending reports
    const completedReports = (reports as Report[] ?? []).filter(r => r.status === "complete");
    const pendingReports = [
        ...(reports as Report[] ?? []).filter(r => r.status !== "complete"),
        ...optimisticPendingReports
    ];

    // When we get new data from API, remove any optimistic reports that are now in the real data
    useEffect(() => {
        if (reports && optimisticPendingReports.length > 0) {
            const reportIds = new Set((reports as Report[]).map(r => r.id));
            
            setOptimisticPendingReports(prev => 
                prev.filter(r => !reportIds.has(r.id))
            );
        }
    }, [reports]);

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

    const handleViewModeChange = (newMode: "grid" | "list") => {
        setViewMode(newMode);
    };

    return (
        <motion.main 
            className="container mx-auto p-4 min-h-[100vh] flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="flex-grow">
                {isLoading && optimisticPendingReports.length === 0 ? (
                    <ReportListLoading viewMode={viewMode} />
                ) : (
                    <ReportList 
                        reports={completedReports} 
                        pendingReports={pendingReports}
                        onNewReport={() => setDialogOpen(true)}
                        onViewModeChange={handleViewModeChange}
                        defaultViewMode={viewMode}
                        userId={userId}
                    />
                )}
            </motion.div>

            <NewReportDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </motion.main>
    );
}
