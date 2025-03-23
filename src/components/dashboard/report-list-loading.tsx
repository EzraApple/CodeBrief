import { Skeleton } from "~/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

interface ReportListLoadingProps {
  viewMode: "grid" | "list";
}

export function ReportListLoading({ viewMode }: ReportListLoadingProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-10 w-[300px]" />
        <div className="flex items-center gap-3">
          <div className="flex">
            <Skeleton className="h-10 w-20" />
          </div>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24 ml-2" />
        </div>
      </div>
      <Skeleton className="h-1 w-full mb-4" />
      
      {viewMode === "grid" ? (
        <ScrollArea className="h-[600px] w-full rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : (
        <div className="flex flex-col divide-y">
          <div className="flex items-center w-full px-4 py-2 text-sm font-medium text-muted-foreground">
            <div className="w-1/4 min-w-[200px]">Repository</div>
            <div className="flex-1 px-4">Description</div>
            <div className="w-[140px] text-right">Last Updated</div>
          </div>
          <ScrollArea className="h-[600px] w-full rounded-md">
            <div className="divide-y">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex items-center px-4 py-4">
                  <div className="w-1/4 min-w-[200px]">
                    <Skeleton className="h-5 w-full max-w-[180px]" />
                  </div>
                  <div className="flex-1 px-4">
                    <Skeleton className="h-5 w-full" />
                  </div>
                  <div className="w-[140px] text-right">
                    <Skeleton className="h-5 w-[90px] ml-auto" />
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      )}
    </section>
  );
} 