// A list of template sections stored on the backend.
// Each section has a unique name (in capitalized form with spaces) and a detailed description,
// including hints for what the LLM can look for to fill out the section.
export const templateSections = [
    {
        name: "Project Overview",
        description: "This section provides an in-depth introduction to the project, detailing its purpose, scope, and overall vision. It explores the primary objectives, target audience, and the value proposition, highlighting unique features and differentiators that set the project apart. Hint: Look for comprehensive details in the README, project documentation, introductory code comments, and any available user guides."
    },
    {
        name: "Architecture Overview",
        description: "This section examines the high-level architecture of the project, outlining the design patterns, key components, and their interactions. It delves into how the code is structured, with a special focus on the repository's directory structure to reveal the separation of concerns and module organization. Hint: Search for architecture diagrams, system design documents, inline code comments, and review the repository's directory layout to understand the overall structure."
    },
    {
        name: "Technology Stack",
        description: "This section provides a detailed overview of the technologies, frameworks, and tools that power the project. It explains the role and integration of each component, the rationale behind their selection, and the benefits and limitations of the chosen stack. Hint: Review package manifests, configuration files, and technical documentation to identify core technologies and gain deeper insights into their application within the project."
    },
    {
        name: "Setup/Installation Instructions",
        description: "This section offers comprehensive, step-by-step instructions for setting up and installing the project, including prerequisites and environment configurations. It covers dependency management, initial configuration steps, and troubleshooting common issues to ensure a smooth installation process. Hint: Examine setup scripts, INSTALL.md or CONTRIBUTING.md files, and configuration examples to extract detailed installation guidelines and tips."
    },
    {
        name: "API & Integration Points",
        description: "This section explores the available APIs and integration points within the project, detailing endpoint functionalities, data formats, and authentication methods. It discusses how external systems can interact with the project and offers guidance on extending or integrating additional services. Hint: Look into API documentation, inline comments near endpoints, integration tests, and any related external service references for a comprehensive understanding."
    },
    {
        name: "Testing & Quality Assurance",
        description: "This section delves into the testing strategies and quality assurance practices implemented in the project. It describes the various testing methodologies, such as unit, integration, and end-to-end tests, along with details about CI/CD integration and code coverage practices. Hint: Identify test suites, CI/CD configuration files, coverage reports, and code review guidelines to compile an extensive overview of QA practices."
    },
    {
        name: "Contribution Guidelines",
        description: "This section outlines detailed guidelines for contributing to the project, including the process for code submissions, issue reporting, and proposing new features. It covers coding standards, branch management, commit message conventions, and the review process to ensure consistency and quality in contributions. Hint: Check for CONTRIBUTING.md, project wikis, and community guidelines to extract comprehensive details about the contribution workflow."
    },
    {
        name: "Security & Compliance",
        description: "This section provides a thorough analysis of the project's security measures and compliance standards. It details the encryption methods, security protocols, data protection practices, and regulatory requirements that safeguard the project. Hint: Search for security policies, audit logs, vulnerability assessments, and compliance documentation to compile a complete picture of the project's security posture."
    }
];
