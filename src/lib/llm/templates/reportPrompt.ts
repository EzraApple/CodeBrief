/**
 * Compiles a prompt for generating a Markdown report.
 *
 * The prompt includes:
 * 1. A brief introduction.
 * 2. The repository context.
 * 3. Detailed instructions to generate the report.
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

General Advice:
- Analyze the repository context carefully and base your insights strictly on the information provided.
- If certain details are ambiguous or missing, clearly indicate the uncertainty.
- Maintain a neutral and factual tone, and avoid making assumptions not supported by the data.
- Do not simply summarize; instead, elaborate with examples, detailed explanations, and actionable insights.
- For each section, please provide a detailed analysis with at least a page for each section covering different aspects. More if needed.
- Make use of paragraphs, code blocks, file-structure diagrams, and file/directory references to be as clear as possible.
- Structure your response with clear headings, subheadings, and bullet points for easy readability.
- Review your report for consistency and clarity to deliver a high-quality response.

Report Template:
-------------------
${reportTemplate}
-------------------

Generate a clear, well-structured Markdown report. Do not include any other text besides the report.
    `.trim();
}
