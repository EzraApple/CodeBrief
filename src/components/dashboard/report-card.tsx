import Link from "next/link";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";

interface ReportCardProps {
  id: string;
  repoUrl: string;
}

export function ReportCard({ id, repoUrl }: ReportCardProps) {
  return (
    <Link href={`/dashboard/${id}`}>
      <Card className="hover:bg-accent transition-colors">
        <CardHeader>
          <CardTitle className="text-lg truncate">{repoUrl}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
} 