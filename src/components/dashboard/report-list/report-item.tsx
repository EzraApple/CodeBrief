import Link from "next/link"
import { Notebook, MoreVertical } from "lucide-react"
import { cn } from "~/lib/shadcn/utils"
import { formatDistanceToNow } from "date-fns"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

interface ReportItemProps {
    id: string
    repoUrl: string
    repoDescription?: string
    className?: string
    updatedAt?: Date
    onDeleteReport: (reportId: string) => void
}

export function ReportItem({
    id,
    repoUrl,
    repoDescription,
    className,
    updatedAt,
    onDeleteReport,
}: ReportItemProps) {
    const repoName = repoUrl.split("/").slice(-2).join("/")
    const timeAgo = updatedAt ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true }) : 'recently'

    return (
        <div className={cn(
            "group w-full hover:bg-accent/30 transition-colors",
            className
        )}>
            <div className="flex items-center w-full px-4 py-3">
                <Link 
                    href={`/dashboard/${id}`} 
                    className="flex items-center flex-1"
                >
                    <div className="flex items-center gap-2 w-1/4 min-w-[200px]">
                        <Notebook className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        <span className="font-medium text-foreground truncate">{repoName}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground flex-1 px-4 truncate">
                        {repoDescription || "No description available"}
                    </p>
                    
                    <span className="text-sm text-muted-foreground flex-shrink-0 w-[140px] text-right">
                        {timeAgo}
                    </span>
                </Link>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 ml-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDeleteReport(id)}
                        >
                            Delete Report
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
} 