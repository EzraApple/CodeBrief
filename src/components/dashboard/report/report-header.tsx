import { PencilIcon, Squares2X2Icon, ChevronDownIcon, ShareIcon } from "@heroicons/react/24/solid";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";

interface ReportHeaderProps {
  repoName: string;
  isEditing: boolean;
  onEditClick: () => void;
  onDownload: (format: "md" | "txt" | "pdf") => void;
}

export function ReportHeader({ repoName, isEditing, onEditClick, onDownload }: ReportHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Squares2X2Icon className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">{repoName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant={isEditing ? "default" : "outline"} 
          size="sm" 
          className="flex items-center gap-2"
          onClick={onEditClick}
        >
          <PencilIcon className="h-4 w-4" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              Download
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDownload("md")}>
              Markdown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload("txt")}>
              Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload("pdf")}>
              PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ShareIcon className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
