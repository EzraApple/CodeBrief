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
import { useSession } from "~/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "~/components/ui/spinner";

export function ReportForm({ repoUrl, repoTree }: ReportFormProps) {
    // Fetch template section names from the backend.
    const { data: init_sections, isLoading: sectionsLoading } =
        api.llm.getTemplateSectionNames.useQuery();

    // Local state for selected model, sections, and ordered section IDs.
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [sections, setSections] = useState<ReportSection[]>([]);
    const [orderedSectionIds, setOrderedSectionIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const { data: session } = useSession();

    // Get available models from the LLM router.
    const { data: modelProviders } = api.llm.getAvailableModels.useQuery();
    const { data: repoDescription } = api.github.getRepoDescription.useQuery({ repoUrl });
    const generateRepoContext = api.context.generateRepoContext.useMutation();
    const promptModel = api.llm.promptModel.useMutation();
    const createReport = api.report.create.useMutation();

    // Update local sections state when the fetched template section names load.
    // Here we assume that each section is represented by its name.
    useEffect(() => {
        if (init_sections) {
            const fetchedSections: ReportSection[] = init_sections.map((name) => ({
                id: name, // Using the name as the id since it's unique.
                label: name,
                checked: false,
            }));
            setSections(fetchedSections);
        }
    }, [init_sections]);

    // Toggle the "checked" state of a section and update the order.
    const handleSectionToggle = (sectionId: string) => {
        setSections((prev) => {
            const newSections = prev.map((section) =>
                section.id === sectionId ? { ...section, checked: !section.checked } : section
            );

            // Find the toggled section.
            const toggledSection = newSections.find((s) => s.id === sectionId);
            if (!toggledSection) return prev;

            // Update ordered sections.
            if (toggledSection.checked) {
                // If checked, add to ordered list if not already present.
                setOrderedSectionIds((prev) => {
                    if (!prev.includes(sectionId)) {
                        return [...prev, sectionId];
                    }
                    return prev;
                });
            } else {
                // If unchecked, remove from ordered list.
                setOrderedSectionIds((prev) => prev.filter((id) => id !== sectionId));
            }

            return newSections;
        });
    };

    // Ensure orderedSectionIds only contains currently checked sections.
    useEffect(() => {
        const checkedIds = new Set(sections.filter((s) => s.checked).map((s) => s.id));
        setOrderedSectionIds((prev) => {
            const filtered = prev.filter((id) => checkedIds.has(id));
            const missing = [...checkedIds].filter((id) => !filtered.includes(id));
            return [...filtered, ...missing];
        });
    }, [sections]);

    // Handle drag and drop reordering of selected sections.
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(orderedSectionIds);
        const [removed] = items.splice(result.source.index, 1);
        if (removed) {
            items.splice(result.destination.index, 0, removed);
            setOrderedSectionIds(items);
        }
    };

    // Handle form submission.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Generate repo context.
            const context = await generateRepoContext.mutateAsync({
                repoUrl,
                style: "xml",
                compress: false,
            });

            // 2. Compile selected sections in their current order as a list of names.
            const selectedSections = orderedSectionIds
                .map((id) => sections.find((s) => s.id === id)?.label ?? "")
                .filter(Boolean);

            // 3. Create a new report record with pending status.
            const newReport = await createReport.mutateAsync({
                userId: session?.user?.id ?? "",
                repoDescription: repoDescription ?? "",
                repoUrl,
            });

            // 4. Trigger the background job to process the prompt.
            promptModel.mutateAsync({
                model: selectedModel,
                context: context.context,
                templateSections: selectedSections,
                reportId: newReport.id,
            });

            // 5. Redirect to the dashboard page with query parameter.
            router.push("/dashboard?fromNewReport=true");
        } catch (error) {
            console.error("Error generating report:", error);
            setIsSubmitting(false);
        }
    };

    // Display a loading state while fetching template section names.
    if (sectionsLoading) {
        return <div>Loading template sections...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
            <div>
                <Label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">
                    Repository URL
                </Label>
                <Input
                    id="repoUrl"
                    type="text"
                    value={repoUrl}
                    readOnly
                    className="mt-1 block w-full"
                    disabled={true}
                />
            </div>

            <div className="space-y-6">
                <ModelSelection
                    selectedModel={selectedModel}
                    modelProviders={modelProviders}
                    onModelChange={setSelectedModel}
                />

                <SectionList sections={sections} onSectionToggle={handleSectionToggle} />

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
                    disabled={!selectedModel || !sections.some((s) => s.checked) || isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner className="mr-2" size="sm" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        "Generate Report"
                    )}
                </Button>
            </div>
        </form>
    );
}
