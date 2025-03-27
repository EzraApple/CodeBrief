// ReportPage.tsx (Server Component)
import { ReportPageClient } from "~/components/dashboard/report/report-page-client";
import { auth } from "~/lib/auth/auth";
import { headers } from "next/headers";

// Define an interface for your dynamic route parameters.
interface ReportPageParams {
  reportId: string;
}

// Define the props for your page component.
interface ReportPageProps {
  params: ReportPageParams;
}

export default async function ReportPage({ params }: ReportPageProps) {
  "use server";

  // Now params is typed and available synchronously.
  const { reportId } = params;

  // Get the session using better-auth's server-side method.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <ReportPageClient reportID={reportId} userID={session?.user?.id ?? ""} />;
}
