import { PencilIcon, Squares2X2Icon, ChevronDownIcon, ShareIcon } from "@heroicons/react/24/solid";
import { Home } from "lucide-react";
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
  hasUnsavedChanges: boolean;
  onSave: () => void;
  isSaving: boolean;
}

export function ReportHeader({
                               repoName,
                               isEditing,
                               onEditClick,
                               onDownload,
                               hasUnsavedChanges,
                               onSave,
                               isSaving,
                             }: ReportHeaderProps) {
  return (
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">{repoName}</h1>
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
              <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={onSave}
                  disabled={isSaving}
              >
                {isSaving ? (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                      <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                      ></circle>
                      <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                ) : (
                    "Save"
                )}
              </Button>
          )}
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
