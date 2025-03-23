import { Card } from "~/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";

interface ModelSelectionProps {
    selectedModel: string;
    modelProviders: Record<string, string[]> | undefined;
    onModelChange: (model: string) => void;
}

export function ModelSelection({ selectedModel, modelProviders, onModelChange }: ModelSelectionProps) {
    return (
        <Card className="p-4">
            <h2 className="text-sm font-medium mb-2">Model Selection</h2>
            <Select value={selectedModel} onValueChange={onModelChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                    {modelProviders && Object.entries(modelProviders).map(([provider, models]) => (
                        <SelectGroup key={provider}>
                            <SelectLabel className="font-semibold">{provider}</SelectLabel>
                            {models.map(model => (
                                <SelectItem key={model} value={model}>
                                    {model}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    ))}
                </SelectContent>
            </Select>
        </Card>
    );
} 