import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css";

interface ReportPreviewProps {
  content: string;
}

export function ReportPreview({ content }: ReportPreviewProps) {
  return (
    <div id="report-preview-pdf" className="markdown-body h-full p-6 overflow-auto">
      {/* PDF-specific overrides */}
      <style>{`
        /* Inline code adjustments: force inline-block, a bit more line-height, and extra bottom margin */
        #report-preview-pdf .markdown-body code {
          display: inline-block !important;
          vertical-align: baseline !important;
          line-height: 1.6 !important;
          margin-bottom: 4px !important;
          padding: 0.1em 0.2em !important;
          background-color: #f6f8fa !important;
          border-radius: 3px !important;
        }
        /* Control page breaks for headings and block elements */
        #report-preview-pdf .markdown-body h1,
        #report-preview-pdf .markdown-body h2,
        #report-preview-pdf .markdown-body h3,
        #report-preview-pdf .markdown-body h4,
        #report-preview-pdf .markdown-body h5,
        #report-preview-pdf .markdown-body h6 {
          page-break-before: auto !important;
          page-break-after: avoid !important;
          break-inside: avoid !important;
        }

        /* Adjust h2 spacing for underline */
        #report-preview-pdf .markdown-body h2 {
          padding-bottom: 0.5em !important;
          margin-bottom: 0.75em !important;
          border-bottom: 1px solid #eaecef !important;
        }
          
       /* Avoid page breaks inside blocks */
        #report-preview-pdf .markdown-body p,
        #report-preview-pdf .markdown-body pre,
        #report-preview-pdf .markdown-body blockquote,
        #report-preview-pdf .markdown-body ul,
        #report-preview-pdf .markdown-body ol {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
