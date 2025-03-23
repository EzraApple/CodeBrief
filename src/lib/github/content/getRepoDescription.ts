// getRepoDescription.ts

/**
 * Retrieves the description of a GitHub repository.
 *
 * @param url - The URL of the GitHub repository.
 * @returns A promise that resolves to the repository description or null.
 */
export async function getRepoDescription(url: string): Promise<string | null> {
    try {
      // Parse the provided URL.
      const parsedUrl = new URL(url);
  
      // Ensure the URL is from GitHub.
      if (!parsedUrl.hostname.includes("github.com")) {
        throw new Error("URL must be a GitHub repository URL");
      }
  
      // Extract the owner and repository name from the URL.
      const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment !== '');
      if (pathSegments.length < 2) {
        throw new Error("Invalid GitHub repository URL. Expected format: https://github.com/owner/repo");
      }
      const [owner, repo] = pathSegments;
  
      // Construct the GitHub API endpoint.
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  
      // Fetch repository data from the GitHub API.
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await response.json();

      // Return the repository description.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
      return data.description;
    } catch (error) {
      console.error("Error fetching repository description:", error);
      throw error;
    }
  }
  