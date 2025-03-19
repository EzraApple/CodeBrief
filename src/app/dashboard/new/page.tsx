"use client";

import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown"; // optional: for Markdown rendering
import { api } from "~/trpc/react";

export default function NewReportPage() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repoUrl");

  // Only run the query if a repoUrl is provided.
  const { data, isLoading, error } = api.github.getRepoTreeFormatted.useQuery(
    { repoUrl: repoUrl ?? "", depth: 5},
    { enabled: Boolean(repoUrl) }
  );

  if (!repoUrl) {
    return (
      <main className="p-4">
        <h1 className="text-4xl font-bold">New Report</h1>
        <p>No repository URL provided.</p>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-4xl font-bold mb-4">New Report</h1>
      {isLoading && <p>Loading repository structure...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div className="prose max-w-none">
          {/* Render the formatted Markdown content */}
          <ReactMarkdown>{data.markdown}</ReactMarkdown>
        </div>
      )}
    </main>
  );
}
