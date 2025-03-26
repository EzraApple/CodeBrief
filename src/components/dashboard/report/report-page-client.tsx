"use client";

import { useState, useEffect } from "react";
import { ReportHeader } from "./report-header";
import { ReportTabSwitch } from "./report-tab-switch";
import { api } from "~/trpc/react";
import React from "react";
import { downloadReport } from "~/lib/utils/downloadReport";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { Home, AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

interface ReportPageClientProps {
  userID: string;
  reportID: string;
}

export function ReportPageClient({ userID, reportID }: ReportPageClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: report, isLoading, error, refetch } = api.report.getById.useQuery({
    id: reportID,
    userId: userID,
  });

  // Set up the update mutation.
  const updateMutation = api.report.update.useMutation();

  // State for the edited content, last saved content, and saving indicator.
  const [editedContent, setEditedContent] = useState<string>("");
  const [lastSavedContent, setLastSavedContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Initialize the content when the report loads.
  useEffect(() => {
    if (report?.modelResponse) {
      setEditedContent(report.modelResponse);
      setLastSavedContent(report.modelResponse);
    }
  }, [report?.modelResponse]);

  // Save function.
  const saveContent = async () => {
    // Only save if there are changes.
    if (editedContent === lastSavedContent) return;
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: reportID,
        userId: userID,
        content: editedContent,
      });
      setLastSavedContent(editedContent);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Listen for cmd+s (Mac) or ctrl+s (other OS) key presses to save.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (editedContent !== lastSavedContent) {
          saveContent();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editedContent, lastSavedContent]);

  if (isLoading) {
    return (
      <main className="flex flex-col h-screen">
        <div>
          <div className="container mx-auto">
            {/* Skeleton Header */}
            <div className="flex items-center justify-between py-4 px-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-9 w-9 opacity-50" disabled>
                  <Home className="h-4 w-4" />
                </Button>
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 p-4">
          {/* Skeleton Content */}
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <div className="flex flex-col gap-4 h-full">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }
  
  if (error || !report) {
    return (
      <main className="flex flex-col h-screen">
        <div>
          <div className="container mx-auto">
            {/* Error Header */}
            <div className="flex items-center justify-between py-4 px-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                  <Link href="/dashboard">
                    <Home className="h-4 w-4" />
                  </Link>
                </Button>
                <h1 className="text-lg font-semibold">Report Error</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 p-4 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Report Not Found
              </CardTitle>
              <CardDescription>
                There was an error loading the requested report.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-destructive/15 text-destructive p-3 rounded-md border border-destructive mb-4">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  Error
                </div>
                <div className="mt-1 text-sm">
                  {error ? error.message : "This report could not be found or accessed."}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button onClick={() => refetch()} className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  const repoName = report.repoUrl.split("/").slice(-2).join("/");

  const handleDownload = async (format: "md" | "txt" | "pdf") => {
    await downloadReport(format, editedContent, repoName);
  };

  return (
      <main className="flex flex-col h-screen">
        <div>
          <div className="container mx-auto">
            <ReportHeader
                repoName={repoName}
                isEditing={isEditing}
                onEditClick={() => setIsEditing((prev) => !prev)}
                onDownload={handleDownload}
                hasUnsavedChanges={editedContent !== lastSavedContent}
                onSave={saveContent}
                isSaving={isSaving}
            />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ReportTabSwitch
              className="h-full"
              isEditing={isEditing}
              content={editedContent}
              onContentChange={setEditedContent}
          />
        </div>
      </main>
  );
}
