"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { GithubIcon, AlertCircle } from "lucide-react";
import { type RepoInputProps, type GithubRepository } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";

export function RepoInput({ initialRepoUrl, onUrlLocked }: RepoInputProps) {
  const [customRepoUrl, setCustomRepoUrl] = useState(initialRepoUrl || "");
  const [isUrlValid, setIsUrlValid] = useState(!!initialRepoUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [selectedRepoName, setSelectedRepoName] = useState<string>("");
  const [selectedRepoDescription, setSelectedRepoDescription] = useState<string>("");
  const [isSelectedRepoPrivate, setIsSelectedRepoPrivate] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [shouldFetchRepoInfo, setShouldFetchRepoInfo] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Fetch user's GitHub repositories
  const { data: userRepos, isLoading: reposLoading } = api.github.getUserRepos.useQuery(undefined, {
    // Only fetch when the search tab is active
    enabled: activeTab === "search",
  });

  // Fetch repository info when URL is submitted
  const { 
    data: repoInfo, 
    isLoading: isRepoInfoLoading,
    error: repoInfoError,
    isFetching: isRepoInfoFetching,
  } = api.github.getRepoInfo.useQuery(
    { repoUrl: customRepoUrl },
    { 
      enabled: shouldFetchRepoInfo && isUrlValid,
      retry: false,
    }
  );

  // Handle successful repo info fetch
  useEffect(() => {
    if (repoInfo && shouldFetchRepoInfo) {
      // Reset the fetch flag
      setShouldFetchRepoInfo(false);
      // Call the callback with URL, description and privacy status
      onUrlLocked(customRepoUrl, repoInfo.description || "", repoInfo.private || false);
    }
  }, [repoInfo, shouldFetchRepoInfo, customRepoUrl, onUrlLocked]);

  // Handle repo info fetch error
  useEffect(() => {
    if (repoInfoError && shouldFetchRepoInfo) {
      // Reset the fetch flag
      setShouldFetchRepoInfo(false);
      
      // Show error animation
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
      
      // Clear the input after shaking
      setTimeout(() => {
        setCustomRepoUrl("");
        if (urlInputRef.current) {
          urlInputRef.current.focus();
        }
      }, 600);
    }
  }, [repoInfoError, shouldFetchRepoInfo]);

  // Filter repos based on search query
  const filteredRepos = useMemo(() => {
    if (!userRepos) return [];
    
    if (!searchQuery.trim()) {
      return userRepos.slice(0, 8); // Return first 8 if no search query
    }
    
    const query = searchQuery.toLowerCase();
    return userRepos
      .filter((repo: GithubRepository) => repo.name.toLowerCase().includes(query) || 
               (repo.description && repo.description.toLowerCase().includes(query)))
      .slice(0, 8); // Limit to top 8 results
  }, [userRepos, searchQuery]);

  // Validate URL format when customRepoUrl changes
  useEffect(() => {
    try {
      // Simple validation - check if it's a properly formatted URL
      new URL(customRepoUrl);
      setIsUrlValid(customRepoUrl.trim().length > 0);
    } catch {
      setIsUrlValid(false);
    }
    
    // Reset the fetch flag when URL changes
    setShouldFetchRepoInfo(false);
  }, [customRepoUrl]);

  // Handle selecting a repository
  const handleRepoSelect = (repo: GithubRepository) => {
    setSelectedRepo(repo.html_url);
    setSelectedRepoName(repo.name);
    setSelectedRepoDescription(repo.description || "");
    setIsSelectedRepoPrivate(repo.private || false);
    setSearchQuery(repo.name); // Set search query to selected repo name
    setIsSearchFocused(false); // Close the dropdown
    
    // Blur the search input to close dropdown and hide keyboard on mobile
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Handle submit button click
  const handleSubmit = () => {
    if (activeTab === "url") {
      if (isUrlValid) {
        // Set the flag to enable the query
        setShouldFetchRepoInfo(true);
      }
    } else if (activeTab === "search" && selectedRepo) {
      onUrlLocked(selectedRepo, selectedRepoDescription, isSelectedRepoPrivate);
    }
  };

  // Determine if the button should be disabled
  const isButtonDisabled = 
    (activeTab === "url" && !isUrlValid) || 
    (activeTab === "search" && !selectedRepo) || 
    isRepoInfoLoading || 
    isRepoInfoFetching;

  return (
    <div className="w-full max-w-md space-y-6">
      <h1 className="text-4xl font-bold">New Report</h1>
      <p className="text-muted-foreground mb-6">Enter a GitHub repository URL or search your repositories to generate a report.</p>
      
      <Tabs defaultValue="url" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Repository URL</TabsTrigger>
          <TabsTrigger value="search">My Repositories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="mt-4">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="repoUrl">Repository URL</Label>
              <div className="flex w-full items-center">
                <Input
                  id="repoUrl"
                  ref={urlInputRef}
                  type="text"
                  placeholder="https://github.com/username/repo"
                  value={customRepoUrl}
                  onChange={(e) => setCustomRepoUrl(e.target.value)}
                  className={cn(
                    "w-full",
                    isShaking && "animate-shake border-destructive"
                  )}
                />
              </div>
              {!isUrlValid && customRepoUrl.length > 0 && (
                <p className="text-sm text-destructive">Please enter a valid URL</p>
              )}
              {repoInfoError && (
                <div className="flex items-center gap-1.5 text-sm text-destructive mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Repository not found or access denied. Please check the URL and try again.</span>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="search" className="mt-4">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="repoSearch">Search your repositories</Label>
              
              <div className="relative w-full">
                <Input
                  id="repoSearch"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full"
                />
                
                {isSearchFocused && (
                  <div className="absolute z-10 w-full mt-1 bg-popover rounded-md border shadow-md">
                    {reposLoading ? (
                      <div className="flex justify-center py-4">
                        <Spinner size="md" />
                      </div>
                    ) : filteredRepos.length > 0 ? (
                      <div className="py-1">
                        {filteredRepos.map((repo: GithubRepository) => (
                          <button
                            key={repo.id}
                            className="flex items-center w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleRepoSelect(repo)}
                          >
                            <GithubIcon className="mr-2 h-4 w-4" />
                            <span className="font-medium">{repo.name}</span>
                            {repo.private && (
                              <span className="ml-2 text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5">
                                private
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : userRepos && userRepos.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No repositories found
                      </p>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        {searchQuery ? "No matching repositories found" : "Start typing to search your repositories"}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {selectedRepo && (
                <div className="flex flex-col mt-2 text-sm bg-secondary/50 rounded-md p-2">
                  <div className="flex items-center">
                    <GithubIcon className="mr-2 h-4 w-4" />
                    <span>Selected: <span className="font-medium">{selectedRepoName}</span></span>
                  </div>
                  {selectedRepoDescription && (
                    <p className="text-muted-foreground text-xs mt-1 ml-6">
                      {selectedRepoDescription}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button 
        className="w-full mt-4"
        onClick={handleSubmit}
        disabled={isButtonDisabled}
      >
        {isRepoInfoLoading || isRepoInfoFetching ? (
          <>
            <Spinner className="mr-2" size="sm" />
            <span>Loading repository...</span>
          </>
        ) : activeTab === "url" ? (
          "Use Repository URL"
        ) : (
          "Use Selected Repository"
        )}
      </Button>
    </div>
  );
} 