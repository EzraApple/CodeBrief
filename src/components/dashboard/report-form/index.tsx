"use client";

import React, { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import type { DropResult } from "@hello-pangea/dnd";
import { api } from "~/trpc/react";
import { ModelSelection } from "./model-selection";
import { SectionList } from "./section-list";
import { SectionOverview } from "./section-overview";
import type { ReportFormProps, ReportSection } from "./types";
import {useSession} from "~/lib/auth/auth-client";
import { useRouter } from "next/navigation";


const INITIAL_SECTIONS: ReportSection[] = [
    { id: "project-overview", label: "Project Overview", checked: false },
    { id: "architecture-overview", label: "Architecture Overview", checked: false },
    { id: "technology-stack", label: "Technology Stack", checked: false },
    { id: "setup-installation", label: "Setup/Installation Instructions", checked: false },
    { id: "api-integration", label: "API & Integration Points", checked: false },
    { id: "testing-qa", label: "Testing & Quality Assurance", checked: false },
    { id: "contribution", label: "Contribution Guidelines", checked: false },
    { id: "security", label: "Security & Compliance", checked: false },
];

export function ReportForm({ repoUrl, repoTree }: ReportFormProps) {
    console.log(repoTree)
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [sections, setSections] = useState<ReportSection[]>(INITIAL_SECTIONS);
    const [orderedSectionIds, setOrderedSectionIds] = useState<string[]>([]);
    const router = useRouter();

    const { data: session } = useSession();
    
    // Get available models from the LLM router
    const { data: modelProviders } = api.llm.getAvailableModels.useQuery();
    const generateRepoContext = api.context.generateRepoContext.useMutation();
    const promptModel = api.llm.promptModel.useMutation();
    const createReport = api.report.create.useMutation();

    const handleSectionToggle = (sectionId: string) => {
        setSections(prev => {
            const newSections = prev.map(section => 
                section.id === sectionId 
                    ? { ...section, checked: !section.checked }
                    : section
            );
            
            // Get the section being toggled
            const toggledSection = newSections.find(s => s.id === sectionId);
            if (!toggledSection) return prev;

            // Update ordered sections
            if (toggledSection.checked) {
                // Add to ordered list if not already present
                setOrderedSectionIds(prev => {
                    if (!prev.includes(sectionId)) {
                        return [...prev, sectionId];
                    }
                    return prev;
                });
            } else {
                // Remove from ordered list
                setOrderedSectionIds(prev => prev.filter(id => id !== sectionId));
            }
            
            return newSections;
        });
    };

    // Ensure orderedSectionIds only contains checked sections
    useEffect(() => {
        const checkedIds = new Set(sections.filter(s => s.checked).map(s => s.id));
        setOrderedSectionIds(prev => {
            const filtered = prev.filter(id => checkedIds.has(id));
            const missing = [...checkedIds].filter(id => !filtered.includes(id));
            return [...filtered, ...missing];
        });
    }, [sections]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(orderedSectionIds);
        const [removed] = items.splice(result.source.index, 1);
        if (removed) {
            items.splice(result.destination.index, 0, removed);
            setOrderedSectionIds(items);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 1. Generate repo context.
            const context = await generateRepoContext.mutateAsync({
                repoUrl,
                style: "xml",
                compress: false,
            });

            // 2. Compile selected sections in their current order.
            const selectedSections = orderedSectionIds
                .map(id => sections.find(s => s.id === id)?.label ?? "")
                .filter(Boolean)
                .join("\n");

            // 3. Create a new report record with pending status.
            const newReport = await createReport.mutateAsync({
                userId: session?.user?.id ?? "",
                repoUrl,
            });

            // 4. Trigger the background job to process the prompt.
            promptModel.mutateAsync({
                model: selectedModel,
                context: context.context,
                template: selectedSections,
                reportId: newReport.id,
            });

            // 5. Redirect to the dashboard page.
            router.push("/dashboard");
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
            <div>
                <Label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">
                    Repository URL
                </Label>
                <Input id="repoUrl" type="text" value={repoUrl} readOnly className="mt-1 block w-full" disabled={true} />
            </div>

            <div className="space-y-6">
                <ModelSelection 
                    selectedModel={selectedModel}
                    modelProviders={modelProviders}
                    onModelChange={setSelectedModel}
                />

                <SectionList 
                    sections={sections}
                    onSectionToggle={handleSectionToggle}
                />

                <SectionOverview 
                    sections={sections}
                    orderedSectionIds={orderedSectionIds}
                    onDragEnd={handleDragEnd}
                />
            </div>

            <div className="pt-4">
                <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!selectedModel || !sections.some(s => s.checked)}
                >
                    Generate Report
                </Button>
            </div>
        </form>
    );
}
