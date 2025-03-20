// src/lib/github/visualization/inferLanguage.ts

export type LanguageDetail = {
    language: string;
    color: string;
};

export function inferLanguage(filename: string): LanguageDetail | null {
    const parts = filename.split(".");
    if (parts.length < 2) return null;
    const ext = parts.pop()?.toLowerCase();

    switch (ext) {
        // TypeScript / JavaScript
        case "ts":
        case "tsx":
            return { language: "TypeScript", color: "#3178c6" };
        case "js":
        case "jsx":
            return { language: "JavaScript", color: "#f1e05a" };

        // Python
        case "py":
            return { language: "Python", color: "#3572A5" };

        // Java
        case "java":
            return { language: "Java", color: "#b07219" };

        // Ruby
        case "rb":
            return { language: "Ruby", color: "#701516" };

        // PHP
        case "php":
            return { language: "PHP", color: "#4F5D95" };

        // C# / .NET
        case "cs":
            return { language: "C#", color: "#178600" };

        // C / C++ / Headers
        case "cpp":
        case "c":
        case "h":
        case "hpp":
            return { language: "C/C++", color: "#f34b7d" };

        // Go
        case "go":
            return { language: "Go", color: "#00ADD8" };

        // Shell
        case "sh":
        case "bash":
        case "zsh":
        case "ksh":
            return { language: "Shell", color: "#89e051" };

        // HTML
        case "html":
        case "htm":
            return { language: "HTML", color: "#e34c26" };

        // CSS / SCSS
        case "css":
            return { language: "CSS", color: "#563d7c" };
        case "scss":
            return { language: "SCSS", color: "#c6538c" };

        // YAML
        case "yml":
        case "yaml":
            return { language: "YAML", color: "#cb171e" };

        // Swift
        case "swift":
            return { language: "Swift", color: "#F05138" };

        // Rust
        case "rs":
            return { language: "Rust", color: "#dea584" };

        // Kotlin
        case "kt":
        case "kts":
            return { language: "Kotlin", color: "#A97BFF" };

        default:
            return null;
    }
}
