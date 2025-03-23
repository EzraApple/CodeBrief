"use client";

import { useState, useEffect } from "react";
import { ReportHeader } from "./report-header";
import { ReportTabSwitch } from "./report-tab-switch";
import { api } from "~/trpc/react";
import React from "react";
import { downloadReport } from "~/lib/utils/downloadReport";

interface ReportPageClientProps {
  userID: string;
  reportID: string;
}

export function ReportPageClient({ userID, reportID }: ReportPageClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: report, isLoading, error } = api.report.getById.useQuery({
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

  if (isLoading) return <p>Loading...</p>;
  if (error || !report) return <p>Report not found</p>;

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
