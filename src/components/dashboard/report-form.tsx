"use client";

import React, { useState } from "react";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

interface ReportFormProps {
    repoUrl: string;
}

export function ReportForm({ repoUrl }: ReportFormProps) {
    const [compress, setCompress] = useState(false);
    // Future options can be handled with additional state values.

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Trigger report generation logic.
        console.log("Report form submitted", { repoUrl, compress });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
            <div>
                <Label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">
                    Repository URL
                </Label>
                <Input id="repoUrl" type="text" value={repoUrl} readOnly className="mt-1 block w-full" disabled={true} />
            </div>

            <div className="grid gap-6 md:grid-rows-2">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold">Context settings</h2>
                    {/* Placeholder for context-specific settings */}
                </Card>
                <Card className="p-6">
                    <h2 className="text-xl font-semibold">Report Template Settings</h2>
                    {/* Placeholder for report template options */}
                </Card>
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full">
                    Generate Report
                </Button>
            </div>
        </form>
    );
}
