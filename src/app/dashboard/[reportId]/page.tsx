// ReportPage.tsx (Server Component)
import { ReportPageClient } from "~/components/dashboard/report/report-page-client";
import { auth } from "~/lib/auth/auth";
import { headers } from "next/headers";

// Define an interface for your dynamic route parameters.
type ReportPageParamsPromise = Promise<{ reportId: string }>;

export default async function ReportPage({ params }: { params: ReportPageParamsPromise }) {
  const { reportId } = await params;

  // Get the session using better-auth's server-side method.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <ReportPageClient reportID={reportId} userID={session?.user?.id ?? ""} />;
}
