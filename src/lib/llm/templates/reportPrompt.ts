/**
 * Compiles a prompt for generating a Markdown report.
 *
 * The prompt includes:
 * 1. A brief introduction.
 * 2. The repository context.
 * 3. Instructions to generate the report.
 * 4. The report template (provided from the frontend).
 *
 * @param repoContext The repository context information.
 * @param reportTemplate The report template from the frontend.
 * @returns A fully composed prompt.
 */
export function compileReportPrompt(repoContext: string, reportTemplate: string): string {
    return `
Introduction:
This report is generated based on the repository context provided below.

Repository Context:
-------------------
${repoContext}
-------------------

Instructions:
Using the repository context above, please generate a comprehensive Markdown report.
Follow the report template provided below for structure and style.

Report Template:
-------------------
${reportTemplate}
-------------------

Generate a clear, well-structured Markdown report.
  `.trim();
}
