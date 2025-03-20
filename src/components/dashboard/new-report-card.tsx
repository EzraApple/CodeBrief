import { Plus } from "lucide-react";
import { Card } from "~/components/ui/card";

interface NewReportCardProps {
  onClick: () => void;
}

export function NewReportCard({ onClick }: NewReportCardProps) {
  return (
    <div className="w-[20%] shrink-0">
      <div className="relative w-full pt-[100%]">
        <Card 
          className="absolute inset-0 hover:bg-accent/50 transition-colors cursor-pointer flex items-center justify-center"
          onClick={onClick}
        >
          <Plus className="h-12 w-12 text-muted-foreground" />
        </Card>
      </div>
    </div>
  );
} 