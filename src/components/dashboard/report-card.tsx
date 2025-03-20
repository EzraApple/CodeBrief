import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "~/lib/shadcn/utils"
import Link from "next/link";

interface ReportCardProps {
  id: string;
  repoUrl: string;
  modelResponse?: string;
  className?: string;
}

export function ReportCard({ id, repoUrl, modelResponse, className }: ReportCardProps) {
  const repoName = repoUrl.split("/").slice(-2).join("/");

  return (
    <Card className={cn("w-full sm:w-1/2 md:w-1/3 lg:w-1/4", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{repoName}</CardTitle>
        </div>
        <CardDescription className="mt-1 text-sm text-muted-foreground">
          {modelResponse ? modelResponse.slice(0, 80) + "..." : "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {/* Could show more content here if needed */}
          {modelResponse ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <a href={repoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            GitHub
          </a>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link href={`/dashboard/${id}`}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
