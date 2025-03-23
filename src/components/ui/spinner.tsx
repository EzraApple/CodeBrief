import { Loader2 } from "lucide-react";
import { cn } from "~/lib/shadcn/utils";
import { LucideProps } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6"
  };

  return (
    <Loader2 
      className={cn(
        "animate-spin text-muted-foreground", 
        sizeClasses[size],
        className
      )}
    />
  );
} 