// ReportPage.tsx (Server Component)
import { ReportPageClient } from "~/components/dashboard/report/report-page-client";
import { auth } from "~/lib/auth/auth";
import { headers } from "next/headers";

export default async function ReportPage({
                                           params,
                                         }: {
  params: { reportId: string };
}) {
  "use server";

  // Wrap params in Promise.resolve() and cast its type so that we can await it.
  const { reportId } = (await Promise.resolve(params)) as { reportId: string };

  // Get the session using better-auth's server-side method
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <ReportPageClient reportID={reportId} userID={session?.user?.id ?? ""} />;
}
