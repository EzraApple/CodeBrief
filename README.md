Below is an example README.md that describes your repository, provides basic setup instructions, and includes links to the pages where you obtain your API keys.

---

# CodeBrief

CodeBrief is a comprehensive code analysis and report generation service designed to help you quickly understand and document GitHub repositories. It uses a combination of repomix for repository analysis and LLM-generated markdown reports to provide an overview of a codebase’s structure, language breakdown, key files, and more.

## Features

- **Repository Analysis:**  
  Automatically clone a GitHub repository (public or private), generate its file tree, and analyze its structure.

- **LLM Report Generation:**  
  Generate a detailed markdown report using an LLM based on the analyzed repository context.

- **User Workflow:**  
  Each account gets 5 free reports. After the free quota is exhausted, users must supply their own Google API key to continue generating reports.

- **Dashboard:**  
  Manage and view your reports through a responsive dashboard.

## Getting Started

Follow these steps to set up and run CodeBrief locally:

### Environment Variables

Create a `.env` file in the root of your project. At a minimum, you need to provide the following variables:

```env
# Prisma database URL (e.g., for SQLite, you might have a file path)
DATABASE_URL="file:./dev.db"

# GitHub OAuth credentials (obtain these from GitHub Developer settings)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google API key for generating reports (if users are required to supply their own after free quota)
GOOGLE_API_KEY=your_google_api_key

# Base URL for your app (ensure it uses HTTPS in production)
NEXT_PUBLIC_BASE_URL=https://code-brief.vercel.app
```

#### How to Get Your API Keys

- **GitHub Client ID and Secret:**  
  Sign in to [GitHub Developer Portal](https://github.com/settings/developers) and create a new OAuth App. Use the provided Client ID and Client Secret in your `.env` file.

- **Google API Key:**  
  Go to the [Google Cloud Console](https://console.cloud.google.com/), create a new project if necessary, and enable the relevant APIs (e.g. Google Custom Search, if that’s what you’re using). Then navigate to the **APIs & Services > Credentials** page to create an API key.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/CodeBrief.git
   cd CodeBrief
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Prisma and the database:**

   If you’re using SQLite locally, run the Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Workflow Overview

1. **Report Generation:**
    - When a user initiates report generation, CodeBrief clones the specified repository.
    - For private repositories, the server uses an authenticated clone URL (using the GitHub access token) and writes temporary files to `/tmp`.
    - Repomix analyzes the repository structure and outputs a file that is then processed to generate a context for the LLM.

2. **LLM Report Generation:**
    - The LLM is prompted with the repository context and a template, returning a detailed markdown report.
    - The report is stored and displayed in the user dashboard.

3. **Usage Limits:**
    - Each account gets 5 free reports.
    - After this limit, users must supply their own Google API key through the account settings.
