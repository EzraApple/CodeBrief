export default async function ReportPage({
  params,
}: {
  params: { reportId: string };
}) {
  const { reportId } = await params;
  
  return (
    <main className="p-4">
      <h1 className="text-4xl font-bold">Report {reportId}</h1>
    </main>
  );
} 