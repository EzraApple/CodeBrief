// lib/github/visualization/inferFileType.ts

export type FileType = "image" | "code" | "text" | "unknown";

/**
 * Infers the file type based on the filename extension.
 *
 * @param filename - The name of the file.
 * @returns "image" if it is an image file, "code" for common code extensions,
 *          "text" for markdown or plain text, otherwise "unknown".
 */
export function inferFileType(filename: string): FileType {
    const parts = filename.split(".");
    if (parts.length < 2) return "unknown";
    const extension = parts.pop()?.toLowerCase() ?? "";

    const imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "svg"];
    const codeExtensions = [
        "js",
        "ts",
        "jsx",
        "tsx",
        "py",
        "java",
        "c",
        "cpp",
        "cs",
        "rb",
        "go",
        "rs",
        "php",
    ];
    const textExtensions = ["md", "txt", "json", "html", "css", "xml", "yml", "yaml"];

    if (imageExtensions.includes(extension)) return "image";
    if (codeExtensions.includes(extension)) return "code";
    if (textExtensions.includes(extension)) return "text";
    return "unknown";
}
