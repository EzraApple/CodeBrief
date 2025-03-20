import { Plus } from "lucide-react";
import { Card } from "~/components/ui/card";

interface NewReportCardProps {
  onClick: () => void;
}

export function NewReportCard({ onClick }: NewReportCardProps) {
  return (
    <Card 
      className="hover:bg-accent transition-colors cursor-pointer flex items-center justify-center h-[120px]"
      onClick={onClick}
    >
      <Plus className="h-8 w-8 text-muted-foreground" />
    </Card>
  );
} 