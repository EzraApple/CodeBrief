// lib/github/visualization/decodeContent.ts

/**
 * Decodes a base64-encoded string into UTF-8 text.
 *
 * @param encoded - The base64-encoded string.
 * @returns The decoded text.
 */
export function decodeTextContent(encoded: string): string {
    return Buffer.from(encoded, "base64").toString("utf-8");
}

/**
 * Decodes base64-encoded image content into a data URL.
 *
 * @param encoded - The base64-encoded image content.
 * @param filename - The filename used to infer the MIME type.
 * @returns A data URL string (e.g., "data:image/png;base64,...").
 */
export function decodeImageContent(encoded: string, filename: string): string {
    const parts = filename.split(".");
    const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : "";
    let mimeType = "image/png"; // default
    switch (extension) {
        case "jpg":
        case "jpeg":
            mimeType = "image/jpeg";
            break;
        case "gif":
            mimeType = "image/gif";
            break;
        case "bmp":
            mimeType = "image/bmp";
            break;
        case "svg":
            mimeType = "image/svg+xml";
            break;
        // Add more cases as needed
    }
    return `data:${mimeType};base64,${encoded}`;
}
