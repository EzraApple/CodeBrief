export async function downloadReport(
  format: "md" | "txt" | "pdf",
  content: string,
  repoName: string
) {
  const fileName = repoName || "report";

  if (format === "md" || format === "txt") {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  } else if (format === "pdf") {
    // Dynamically import html2pdf.js
    const { default: html2pdf } = await import("html2pdf.js");

    // Get the element containing the rendered preview
    const element = document.getElementById("report-preview-pdf");
    if (!element) {
      console.error("Preview element not found for PDF generation.");
      return;
    }

    const opt = {
      margin: 10,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: "#ffffff", 
        logging: true 
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "portrait" 
      },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    }
  }
} 