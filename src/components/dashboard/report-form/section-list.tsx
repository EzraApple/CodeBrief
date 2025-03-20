import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import type { ReportSection } from "./types";

interface SectionListProps {
    sections: ReportSection[];
    onSectionToggle: (sectionId: string) => void;
}

export function SectionList({ sections, onSectionToggle }: SectionListProps) {
    return (
        <Card className="p-4">
            <h2 className="text-sm font-medium mb-3">Report Sections</h2>
            <div className="grid grid-cols-2 gap-2">
                {sections.map((section) => (
                    <div key={section.id} className="flex items-start space-x-2">
                        <Checkbox
                            id={section.id}
                            checked={section.checked}
                            onCheckedChange={() => onSectionToggle(section.id)}
                        />
                        <Label htmlFor={section.id} className="text-sm leading-none pt-0.5">
                            {section.label}
                        </Label>
                    </div>
                ))}
            </div>
        </Card>
    );
} 