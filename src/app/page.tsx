"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useSession } from "~/lib/auth/auth-client";

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const isValid = url.trim() === "" || isValidUrl(url);

  return (
    <div className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center p-4">
      <div className="container flex max-w-5xl flex-col items-center gap-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Explain New Codebases
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Generate an instant overview of any public GitHub repository. Summaries, architecture insights, and key insights at your fingertips.
          </p>
        </div>
        
        <div className="w-full max-w-xl space-y-2">
          <form 
            className="relative w-full"
            onSubmit={(e) => {
              e.preventDefault();
              const target = session 
                ? `/dashboard/new?repoUrl=${encodeURIComponent(url)}`
                : `/login?repoUrl=${encodeURIComponent(url)}`;
              router.push(target);
            }}
          >
            <div className="shadow-lg rounded-full overflow-hidden">
              <Input
                type="text"
                placeholder="paste public github url"
                className="w-full border-b rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6 pr-16 pl-6"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button 
                type="submit" 
                disabled={!isValidUrl(url)}
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full h-12 w-12 flex items-center justify-center"
                size="icon"
              >
                <ArrowRight className="h-12 w-12" />
              </Button>
            </div>
          </form>
          {url && !isValid && (
            <p className="text-sm text-destructive">Please enter a valid URL</p>
          )}
        </div>
        
        <div className="mt-12 w-full">
          <div className="flex justify-center items-center gap-6 mx-auto">
            <div className="flex flex-col items-center w-[200px]">
              <Card className="h-40 w-full cursor-pointer border border-gray-200 bg-white transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-xl hover:scale-105 hover:bg-blue-50">
                <CardContent className="p-5 flex flex-col items-center justify-center h-full">
                  <p className="font-medium text-center text-lg">Pick a repository</p>
                  <p className="text-sm text-gray-500 mt-2 text-center">Paste any public GitHub repo URL to analyze its structure</p>
                </CardContent>
              </Card>
            </div>
            
            <ArrowRight className="h-10 w-10 text-muted-foreground flex-shrink-0 transition-all duration-300 ease-in-out hover:text-primary hover:scale-110" />
            
            <div className="flex flex-col items-center w-[200px]">
              <Card className="h-40 w-full cursor-pointer border border-gray-200 bg-white transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-xl hover:scale-105 hover:bg-blue-50">
                <CardContent className="p-5 flex flex-col items-center justify-center h-full">
                  <p className="font-medium text-center text-lg">Design a report</p>
                  <p className="text-sm text-gray-500 mt-2 text-center">Specify what aspects of the codebase you want to understand</p>
                </CardContent>
              </Card>
            </div>
            
            <ArrowRight className="h-10 w-10 text-muted-foreground flex-shrink-0 transition-all duration-300 ease-in-out hover:text-primary hover:scale-110" />
            
            <div className="flex flex-col items-center w-[200px]">
              <Card className="h-40 w-full cursor-pointer border border-gray-200 bg-white transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-xl hover:scale-105 hover:bg-blue-50">
                <CardContent className="p-5 flex flex-col items-center justify-center h-full">
                  <p className="font-medium text-center text-lg">LLM analysis</p>
                  <p className="text-sm text-gray-500 mt-2 text-center">Advanced AI models process the code and create insights</p>
                </CardContent>
              </Card>
            </div>
            
            <ArrowRight className="h-10 w-10 text-muted-foreground flex-shrink-0 transition-all duration-300 ease-in-out hover:text-primary hover:scale-110" />
            
            <div className="flex flex-col items-center w-[200px]">
              <Card className="h-40 w-full cursor-pointer border border-gray-200 bg-white transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-xl hover:scale-105 hover:bg-blue-50">
                <CardContent className="p-5 flex flex-col items-center justify-center h-full">
                  <p className="font-medium text-center text-lg">Code report</p>
                  <p className="text-sm text-gray-500 mt-2 text-center">Get architecture, file structure, and key component explanations</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
