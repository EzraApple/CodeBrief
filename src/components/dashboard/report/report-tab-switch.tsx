import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { ReportEdit } from "./report-edit";
import { ReportPreview } from "./report-preview";

interface ReportTabSwitchProps {
  className?: string;
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
}

export function ReportTabSwitch({ 
  className, 
  isEditing, 
  content,
  onContentChange 
}: ReportTabSwitchProps) {
  if (!isEditing) {
    return (
      <div className={className}>
        <div className="h-full">
          <Card className="h-full">
            <CardContent className="h-full pt-6">
              {/* Wrap ReportPreview with a unique ID */}
              <div id="report-preview-pdf" className="h-full">
                <ReportPreview content={content} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Desktop view - Split layout */}
      <div className="hidden lg:block h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
            <ReportEdit 
              content={content} 
              onChange={onContentChange}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div id="report-preview-pdf" className="h-full">
              <ReportPreview content={content} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile/Tablet view - Tabs */}
      <div className="lg:hidden h-full">
        <Tabs defaultValue="edit" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <PencilIcon className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Edit Mode</CardTitle>
                <CardDescription>
                  Make changes to your report here.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[500px]">
                <ReportEdit 
                  content={content} 
                  onChange={onContentChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Preview Mode</CardTitle>
                <CardDescription>
                  Preview your report in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[500px]">
                <ReportPreview content={content} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
