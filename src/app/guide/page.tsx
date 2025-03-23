export default function GuidePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">CodeBrief Guide</h1>
      
      <div className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <p>
            CodeBrief helps you understand new codebases quickly. Simply paste a public GitHub repository URL
            and let CodeBrief generate a comprehensive analysis and overview.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How to Use</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Find a public GitHub repository you want to understand</li>
            <li>Copy the repository URL (e.g., https://github.com/username/repository)</li>
            <li>Paste the URL in the input field on the home page</li>
            <li>Click the arrow button to generate the analysis</li>
            <li>Explore the codebase insights in your dashboard</li>
          </ol>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Code structure visualization</li>
            <li>Language breakdown analysis</li>
            <li>Key files and components identification</li>
            <li>Project architecture overview</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 