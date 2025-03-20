"use client";

import { useState } from "react";
import { useSession } from "~/lib/auth/auth-client";
import { api } from "~/trpc/react";
import { ReportCard } from "~/components/dashboard/report-card";
import { PendingReportCard } from "~/components/dashboard/pending-report-card";
import { NewReportCard } from "~/components/dashboard/new-report-card";
import { NewReportDialog } from "~/components/dashboard/new-report-dialog";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

interface Report {
    id: string;
    repoUrl: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    repoContextId: string | null;
    modelResponse: string | null;
    status: string;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [dialogOpen, setDialogOpen] = useState(false);

    // Poll the reports query every 5000ms (5 seconds)
    const { data: reports, isLoading } = api.report.getByUserId.useQuery(
        { userId: session?.user?.id ?? "" },
        { enabled: Boolean(session?.user?.id), refetchInterval: 5000 }
    );

    // Split reports into pending (queue) and completed (library)
    const pendingReports = (reports as Report[] ?? []).filter(r => r.status === "pending");
    const completedReports = (reports as Report[] ?? []).filter(r => r.status === "complete");

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">Your Reports</h1>

            {isLoading && <p>Loading your reports...</p>}

            {/* Report Queue Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Report Queue</h2>
                <ScrollArea className="w-full rounded-md border">
                    <div className="flex gap-4 p-4">
                        <NewReportCard onClick={() => setDialogOpen(true)} />
                        {pendingReports.length > 0 ? (
                            pendingReports.map((report: Report) => (
                                <PendingReportCard
                                    key={report.id}
                                    repoUrl={report.repoUrl}
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground py-2">
                                No reports are currently generating.
                            </p>
                        )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </section>

            <Separator className="my-8" />

            {/* Report Library Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Report Library</h2>
                <ScrollArea className="w-full rounded-md">
                    <div className="flex gap-4 flex-wrap p-4">
                        {completedReports.length > 0 ? (
                            completedReports.map((report: Report) => (
                                <ReportCard
                                    key={report.id}
                                    id={report.id}
                                    repoUrl={report.repoUrl}
                                    modelResponse={report.modelResponse}
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground py-2">
                                You haven&apos;t completed any reports yet.
                            </p>
                        )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </section>

            <NewReportDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </main>
    );
}
