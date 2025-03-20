import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface NewReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewReportDialog({ open, onOpenChange }: NewReportDialogProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      new URL(url); // Validate URL
      router.push(`/dashboard/new?repoUrl=${encodeURIComponent(url)}`);
      onOpenChange(false); // Close dialog
    } catch {
      setIsValid(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter GitHub repository URL"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setIsValid(true); // Reset validation on change
            }}
          />
          {!isValid && (
            <p className="text-sm text-destructive">Please enter a valid URL</p>
          )}
          <Button type="submit" className="w-full">
            Create Report
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 