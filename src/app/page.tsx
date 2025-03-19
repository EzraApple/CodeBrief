"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
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
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="container flex max-w-2xl flex-col items-center gap-8">
        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">
          Explain New Codebases
        </h1>
        
        <div className="w-full max-w-lg space-y-2">
          <form 
            className="flex w-full gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const target = session 
                ? `/dashboard/new?repoUrl=${encodeURIComponent(url)}`
                : `/login?repoUrl=${encodeURIComponent(url)}`;
              router.push(target);
            }}
          >
            <Input
              type="text"
              placeholder="paste public github url"
              className="flex-1"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button type="submit" disabled={!isValidUrl(url)}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          {url && !isValid && (
            <p className="text-sm text-destructive">Please enter a valid URL</p>
          )}
        </div>
      </div>
    </main>
  );
}
