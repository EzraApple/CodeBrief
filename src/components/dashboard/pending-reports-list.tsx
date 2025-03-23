import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { NewReportCard } from "~/components/dashboard/new-report-card";
import { PendingReportCard } from "~/components/dashboard/pending-report-card";

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

interface PendingReportsListProps {
    pendingReports: Report[];
    onNewReport: () => void;
    isLoading?: boolean;
}

export function PendingReportsList({
    pendingReports,
    onNewReport,
    isLoading = false,
}: PendingReportsListProps) {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">In Progress</h2>
            <ScrollArea className="w-full rounded-md">
                <div className="flex gap-4 p-4">
                    <NewReportCard onClick={onNewReport} />
                    {isLoading ? (
                        <p className="text-muted-foreground py-2">Loading reports...</p>
                    ) : pendingReports.length > 0 ? (
                        pendingReports.map((report) => (
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
    );
} 