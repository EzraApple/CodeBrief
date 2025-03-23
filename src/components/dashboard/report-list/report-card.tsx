import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"
import { Notebook, MoreHorizontal } from "lucide-react"
import { cn } from "~/lib/shadcn/utils"
import { formatDistanceToNow } from "date-fns"
import { Separator } from "~/components/ui/separator"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

interface ReportCardProps {
    id: string
    repoUrl: string
    repoDescription?: string
    className?: string
    updatedAt?: Date
    onDeleteReport: (reportId: string) => void
}

export function ReportCard({
    id,
    repoUrl,
    repoDescription,
    className,
    updatedAt,
    onDeleteReport,
}: ReportCardProps) {
    const repoName = repoUrl.split("/").slice(-2).join("/")
    const timeAgo = updatedAt ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true }) : 'recently'

    return (
        // Updated from aspect-square to aspect-[3/2] for a 3:2 (60/40) rectangle ratio
        <div className="aspect-[4/2]">
            <Card
                className={cn(
                    "border border-border shadow-md rounded-lg bg-white h-full flex flex-col",
                    "transform transition-all duration-100 hover:scale-[1.01] hover:bg-accent/30",
                    className
                )}
            >
                <CardHeader className="pb-0 flex-grow relative">
                    <div className="absolute top-2 right-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
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
                    
                    <Link href={`/dashboard/${id}`} className="block">
                        <div className="flex items-center gap-2">
                            <Notebook className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg truncate">{repoName}</CardTitle>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {repoDescription ?? "No description available"}
                        </CardDescription>
                    </Link>
                </CardHeader>
                <CardContent className="pt-2 mt-0 pb-2">
                    <Separator className="my-0" />
                    <p className="text-xs text-muted-foreground mt-2">
                        Updated {timeAgo}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 