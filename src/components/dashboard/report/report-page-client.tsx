"use client";

import { useState, useEffect } from "react";
import { ReportHeader } from "./report-header";
import { ReportTabSwitch } from "./report-tab-switch";
import { api } from "~/trpc/react";
import React from "react";

interface ReportPageClientProps {
  userID: string;
  reportID: string;
}

export function ReportPageClient({ userID, reportID }: ReportPageClientProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Use the tRPC useQuery hook to fetch the report data
  const { data: report, isLoading, error } = api.report.getById.useQuery({
    id: reportID,
    userId: userID,
  });

  // State for edited content
  const [editedContent, setEditedContent] = useState<string>("");

  // Update edited content when report loads
  useEffect(() => {
    if (report?.modelResponse) {
      setEditedContent(report.modelResponse);
    }
  }, [report?.modelResponse]);

  if (isLoading) return <p>Loading...</p>;
  if (error || !report) return <p>Report not found</p>;

  // Extract repo name from URL
  const repoName = report.repoUrl.split('/').slice(-2).join('/');

  // Download handler function
  const handleDownload = async (format: "md" | "txt" | "pdf") => {
    const fileContent = editedContent;
    const fileName = repoName || "report";

    if (format === "md" || format === "txt") {
      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "pdf") {
  // Dynamically import html2pdf.js
  const { default: html2pdf } = await import("html2pdf.js");

  // Get the element containing the rendered preview (make sure it's visible)
  const element = document.getElementById("report-preview-pdf");
  if (!element) {
    console.error("Preview element not found for PDF generation.");
    return;
  }

  const opt = {
    margin: 10,
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("PDF generation error:", error);
  }
}

  };

  return (
    <main className="flex flex-col h-screen">
      <div className="container">
        <ReportHeader 
          repoName={repoName} 
          isEditing={isEditing}
          onEditClick={() => setIsEditing(!isEditing)}
          onDownload={handleDownload}
        />
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
