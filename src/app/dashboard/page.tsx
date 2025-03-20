"use client";

import { useState } from "react";
import { useSession } from "~/lib/auth/auth-client";
import { api } from "~/trpc/react";
import { ReportCard } from "~/components/dashboard/report-card";
import { NewReportCard } from "~/components/dashboard/new-report-card";
import { NewReportDialog } from "~/components/dashboard/new-report-dialog";

interface Report {
  id: string;
  repoUrl: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: reports, isLoading } = api.report.getByUserId.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: Boolean(session?.user?.id) }
  );

console.log(session)
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Your Reports</h1>
      
      {isLoading && <p>Loading your reports...</p>}
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <NewReportCard onClick={() => setDialogOpen(true)} />
        {reports?.map((report: Report) => (
          <ReportCard
            key={report.id}
            id={report.id}
            repoUrl={report.repoUrl}
          />
        ))}
      </div>
      
      {reports?.length === 0 && (
        <p className="text-muted-foreground">
          You haven&#39;t created any reports yet.
        </p>
      )}

      <NewReportDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </main>
  );
} 