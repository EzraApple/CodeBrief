import {templateSections} from "~/lib/llm/templates/defaultSections";
export function compileTemplate(selectedSectionNames: string[]): string {
    // Filter and maintain the order of sections based on the provided names.
    const selectedSections = templateSections.filter(section =>
        selectedSectionNames.includes(section.name)
    );

    // Build the template by mapping each section to a formatted block.
    const compiledBlocks = selectedSections.map(section => {
        return `# ${section.name}\nDescription: ${section.description}\n`;
    });

    // Join all the blocks into one final template string.
    return compiledBlocks.join("\n");
}
