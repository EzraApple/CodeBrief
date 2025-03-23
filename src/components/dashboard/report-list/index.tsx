import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { LayoutGrid, List, ChevronDown, Search, Check, Plus, X } from "lucide-react";
import { ReportCard } from "./report-card";
import { ReportItem } from "./report-item";
import { cn } from "~/lib/shadcn/utils";
import { useState, useMemo, useEffect } from "react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Badge } from "~/components/ui/badge";
import { Spinner } from "~/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";

interface Report {
    id: string;
    repoUrl: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    repoContextId: string | null;
    modelResponse: string | null;
    status: string;
    repoDescription?: string;
}

interface ReportListProps {
    reports: Report[];
    pendingReports?: Report[];
    onNewReport: () => void;
    onViewModeChange?: (mode: "grid" | "list") => void;
    defaultViewMode: "grid" | "list";
    userId: string;
    onPendingReportDeleted?: (reportId: string) => void;
}

type SortOption = "updatedAt" | "createdAt" | "name";

// Animation variants for view mode transitions
const listItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
            duration: 0.2,
            ease: "easeOut" 
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.1,
            ease: "easeIn"
        }
    }
};

export function ReportList({ 
    reports, 
    pendingReports = [],
    onNewReport, 
    onViewModeChange,
    defaultViewMode = "grid",
    userId,
    onPendingReportDeleted
}: ReportListProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">(defaultViewMode);
    const [sortBy, setSortBy] = useState<SortOption>("updatedAt");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredReports, setFilteredReports] = useState<Report[]>(reports);
    const [reportToDelete, setReportToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [localPendingReports, setLocalPendingReports] = useState<Report[]>(pendingReports);
    const { toast } = useToast();
    
    const utils = api.useUtils();
    const deleteReportMutation = api.report.delete.useMutation({
        onSuccess: () => {
            toast({
                title: "Report deleted",
                description: "Your report has been successfully deleted.",
            });
            void utils.report.getByUserId.invalidate();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: `Failed to delete report: ${error.message}`,
                variant: "destructive",
            });
        }
    });

    // Add a key state to force re-render animation when sort changes
    const [animationKey, setAnimationKey] = useState(0);

    // Update localPendingReports when pendingReports prop changes
    useEffect(() => {
        setLocalPendingReports(pendingReports);
    }, [pendingReports]);

    // Handler for report deletion with confirmation
    const handleDeleteReport = (reportId: string) => {
        setReportToDelete(reportId);
        setIsDeleteDialogOpen(true);
    };

    // Handler for deleting pending reports directly
    const handleDeletePendingReport = (reportId: string) => {
        // Optimistic UI update
        setLocalPendingReports(prev => prev.filter(report => report.id !== reportId));
        
        // Call the API to delete the report
        deleteReportMutation.mutate({
            id: reportId,
            userId
        });
        
        // Notify parent component if needed
        if (onPendingReportDeleted) {
            onPendingReportDeleted(reportId);
        }
    };

    // Confirm deletion and process it
    const confirmDelete = () => {
        if (reportToDelete) {
            // Optimistic update - remove the report from the filtered list immediately
            setFilteredReports(prev => prev.filter(report => report.id !== reportToDelete));
            
            // Call the API to delete the report
            deleteReportMutation.mutate({
                id: reportToDelete,
                userId
            });
            
            // Close the dialog
            setIsDeleteDialogOpen(false);
            setReportToDelete(null);
        }
    };

    // Update local viewMode when parent's defaultViewMode changes
    useEffect(() => {
        if (defaultViewMode !== viewMode) {
            setViewMode(defaultViewMode);
        }
    }, [defaultViewMode, viewMode]);

    // Notify parent of viewMode changes
    const handleViewModeChange = (newMode: "grid" | "list") => {
        setViewMode(newMode);
        if (onViewModeChange) {
            onViewModeChange(newMode);
        }
    };

    // Update filtered reports when reports prop changes
    useEffect(() => {
        setFilteredReports(reports);
    }, [reports]);

    // Filter reports based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredReports(reports);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = reports.filter(report => {
            const repoName = report.repoUrl.split("/").slice(-2).join("/").toLowerCase();
            const description = (report.repoDescription || "").toLowerCase();
            
            return repoName.includes(query) || description.includes(query);
        });
        
        setFilteredReports(filtered);
    }, [searchQuery, reports]);

    // Sort the filtered reports
    const sortedReports = useMemo(() => {
        const reportsCopy = [...filteredReports];
        
        switch(sortBy) {
            case "updatedAt":
                return reportsCopy.sort((a, b) => 
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
            case "createdAt":
                return reportsCopy.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            case "name":
                return reportsCopy.sort((a, b) => {
                    const nameA = a.repoUrl.split("/").slice(-2).join("/").toLowerCase();
                    const nameB = b.repoUrl.split("/").slice(-2).join("/").toLowerCase();
                    return nameA.localeCompare(nameB);
                });
            default:
                return reportsCopy;
        }
    }, [filteredReports, sortBy]);

    const getSortLabel = () => {
        switch(sortBy) {
            case "updatedAt": return "Last Updated";
            case "createdAt": return "Date Created";
            case "name": return "Name";
            default: return "Sort By";
        }
    };

    // Update the setSortBy function to trigger animation
    const handleSortChange = (newSortBy: SortOption) => {
        if (sortBy !== newSortBy) {
            setSortBy(newSortBy);
            // Increment the key to trigger animation
            setAnimationKey(prev => prev + 1);
        }
    };

    // Handle search with debounced animation
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        const prevResults = getFilteredResults(searchQuery);
        const newResults = getFilteredResults(newQuery);
        
        // Update search query
        setSearchQuery(newQuery);
        
        // Only trigger animation if the filtered results actually change
        if (prevResults.length !== newResults.length || 
            JSON.stringify(prevResults.map(r => r.id)) !== JSON.stringify(newResults.map(r => r.id))) {
            setAnimationKey(prev => prev + 1);
        }
    };
    
    // Helper function to get filtered results for a query
    const getFilteredResults = (query: string): Report[] => {
        if (!query.trim()) {
            return reports;
        }
        
        const normalizedQuery = query.toLowerCase().trim();
        return reports.filter(report => {
            const repoName = report.repoUrl.split("/").slice(-2).join("/").toLowerCase();
            const description = (report.repoDescription || "").toLowerCase();
            
            return repoName.includes(normalizedQuery) || description.includes(normalizedQuery);
        });
    };

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="relative">
                    <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input 
                        type="text" 
                        placeholder="search your repositories" 
                        className="pl-8 w-full min-w-[300px] rounded-full" 
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex rounded-md overflow-hidden border">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className={cn(
                                "rounded-none",
                                viewMode === "grid" ? "bg-accent" : ""
                            )}
                            onClick={() => handleViewModeChange("grid")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className={cn(
                                "rounded-none",
                                viewMode === "list" ? "bg-accent" : ""
                            )}
                            onClick={() => handleViewModeChange("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-1">
                                {getSortLabel()} <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSortChange("updatedAt")} className="flex items-center justify-between">
                                Last Updated {sortBy === "updatedAt" && <Check className="h-4 w-4 ml-2" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSortChange("createdAt")} className="flex items-center justify-between">
                                Date Created {sortBy === "createdAt" && <Check className="h-4 w-4 ml-2" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSortChange("name")} className="flex items-center justify-between">
                                Name {sortBy === "name" && <Check className="h-4 w-4 ml-2" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                        onClick={onNewReport} 
                        variant="default" 
                        className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        New Report
                    </Button>
                    
                    {localPendingReports.length > 0 && (
                        <>
                            <Separator orientation="vertical" className="h-8" />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Badge variant="secondary" className="rounded-full">
                                            {localPendingReports.length}
                                        </Badge>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Pending Reports</h4>
                                        <p className="text-sm text-muted-foreground">
                                            These reports are currently being processed.
                                        </p>
                                        <Separator />
                                        <div className="max-h-[200px] overflow-auto space-y-2">
                                            {localPendingReports.map(report => (
                                                <div key={report.id} className="flex items-center justify-between text-sm py-1">
                                                    <span className="truncate flex-1">
                                                        {report.repoUrl.split("/").slice(-2).join("/")}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <Spinner size="sm" className="text-gray-500" />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full"
                                                            onClick={() => handleDeletePendingReport(report.id)}
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            <span className="sr-only">Delete pending report</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </>
                    )}
                </div>
            </div>
            <Separator className="mb-4" />
            <div className="w-full">
                {sortedReports.length > 0 ? (
                    <AnimatePresence mode="wait">
                        {viewMode === "grid" ? (
                            <motion.div
                                key={`grid-view-${animationKey}`}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={listItemVariants}
                            >
                                <ScrollArea className="h-[calc(100vh-160px)] w-full rounded-md">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
                                        {sortedReports.map((report) => (
                                            <ReportCard
                                                key={report.id}
                                                id={report.id}
                                                repoUrl={report.repoUrl}
                                                repoDescription={report.repoDescription}
                                                updatedAt={report.updatedAt}
                                                onDeleteReport={handleDeleteReport}
                                            />
                                        ))}
                                    </div>
                                    <ScrollBar orientation="vertical" />
                                </ScrollArea>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`list-view-${animationKey}`}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={listItemVariants}
                            >
                                <div className="flex flex-col divide-y">
                                    <div className="flex items-center w-full px-4 py-2 text-sm font-medium text-muted-foreground">
                                        <div className="w-1/4 min-w-[200px]">Repository</div>
                                        <div className="flex-1 px-4">Description</div>
                                        <div className="w-[140px] text-right">Last Updated</div>
                                    </div>
                                    <ScrollArea className="h-[calc(100vh-160px)] w-full rounded-md">
                                        <div className="divide-y">
                                            {sortedReports.map((report) => (
                                                <ReportItem
                                                    key={report.id}
                                                    id={report.id}
                                                    repoUrl={report.repoUrl}
                                                    repoDescription={report.repoDescription}
                                                    updatedAt={report.updatedAt}
                                                    onDeleteReport={handleDeleteReport}
                                                />
                                            ))}
                                        </div>
                                        <ScrollBar orientation="vertical" />
                                    </ScrollArea>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : searchQuery ? (
                    <p className="text-muted-foreground py-2">
                        No matching reports found. Try adjusting your search.
                    </p>
                ) : (
                    <p className="text-muted-foreground py-2">
                        You haven&apos;t completed any reports yet.
                    </p>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this report. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    );
} 