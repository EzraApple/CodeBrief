import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/shadcn/utils";
import { BookOpen } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

interface PendingReportCardProps {
  repoUrl: string;
  className?: string;
}

export function PendingReportCard({ repoUrl, className }: PendingReportCardProps) {
  // Extract repo name from URL
  const repoName = repoUrl.split('/').slice(-2).join('/');

  return (
    <div className="w-[20%] shrink-0">
      <div className="relative w-full pt-[100%]">
        <Card
          className={cn(
            "absolute inset-0 flex flex-col hover:bg-accent/50 transition-colors",
            className
          )}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-lg font-semibold break-all"
              >
                {repoName}
              </a>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 py-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-[80%] animate-pulse" />
              <Skeleton className="h-4 w-[90%] animate-pulse" />
              <Skeleton className="h-4 w-[70%] animate-pulse" />
              <Skeleton className="h-4 w-[85%] animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 