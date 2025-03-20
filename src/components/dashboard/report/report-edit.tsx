import React from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { ScrollArea } from "~/components/ui/scroll-area";

interface ReportEditProps {
  content: string;
  onChange: (value: string) => void;
}

export function ReportEdit({ content, onChange }: ReportEditProps) {
  return (
    <div className="h-full p-6">
      <ScrollArea className="h-full">
        <CodeMirror
          value={content}
          height="100%"
          theme="light"
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
          }}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
            EditorView.lineWrapping
          ]}
          onChange={(value) => onChange(value)}
          className="font-mono"
          placeholder="Report content will appear here..."
        />
      </ScrollArea>
    </div>
  );
}
