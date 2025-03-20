// ReportPage.tsx (Server Component)
import { ReportPageClient } from "~/components/dashboard/report/report-page-client";
import { auth } from "~/lib/auth/auth";
import { headers } from "next/headers";
import { api } from "~/trpc/react";

export default async function ReportPage({
  params,
}: {
  params: { reportId: string };
}) {
  "use server";

  const { reportId } = await params;
  
  // Get the session using better-auth's server-side method
  const session = await auth.api.getSession({
    headers: headers(),
  });



  return <ReportPageClient reportID={reportId} userID={session?.user?.id ?? ""} />;
}
