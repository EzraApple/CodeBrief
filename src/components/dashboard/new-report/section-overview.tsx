import { Card } from "~/components/ui/card";
import { DragDropContext, Draggable, Droppable, type DropResult, type DroppableProvided, type DraggableProvided } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import type { ReportSection } from "./types";

interface SectionOverviewProps {
    sections: ReportSection[];
    orderedSectionIds: string[];
    onDragEnd: (result: DropResult) => void;
}

export function SectionOverview({ sections, orderedSectionIds, onDragEnd }: SectionOverviewProps) {
    if (!sections.some(section => section.checked)) {
        return null;
    }

    return (
        <Card className="p-4">
            <h2 className="text-sm font-medium mb-3">Report Overview</h2>
            <p className="text-xs text-muted-foreground mb-2">Drag to reorder sections</p>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                    {(provided: DroppableProvided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-1.5"
                        >
                            {orderedSectionIds.map((sectionId, index) => {
                                const section = sections.find(s => s.id === sectionId);
                                if (!section?.checked) return null;
                                
                                return (
                                    <Draggable
                                        key={`ordered-${sectionId}-${index}`}
                                        draggableId={sectionId}
                                        index={index}
                                    >
                                        {(provided: DraggableProvided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="flex items-center justify-between p-2 bg-white rounded-md border shadow-sm"
                                            >
                                                <span className="text-sm">
                                                    {index + 1}. {section.label}
                                                </span>
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <GripVertical size={16} />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Card>
    );
} 