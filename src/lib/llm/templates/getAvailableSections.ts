// Function to extract the names from a list of template sections.
// It takes in an array of sections and returns an array of their names.
export function extractTemplateSectionNames(
    sections: { name: string; description: string }[]
): string[] {
    return sections.map((section) => section.name);
}
