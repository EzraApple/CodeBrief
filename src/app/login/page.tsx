"use client";

import { useSearchParams } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { LoginBox } from "~/components/auth/login-box";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repoUrl") || null; // If not provided, null
  
  return (
    <main className="container mx-auto flex h-[calc(100vh-4rem)]">
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <LoginBox repoUrl={repoUrl} />
      </div>

      <Separator orientation="vertical" />

      {/* Right side - Placeholder */}
      <div className="flex flex-1 flex-col items-center justify-start p-8">
        <div className="w-full max-w-sm">
          <h1 className="mb-8 text-3xl font-semibold">
            {repoUrl ? "New Report Preview" : "Welcome Back"}
          </h1>
          {/* You can add further conditional UI here */}
        </div>
      </div>
    </main>
  );
}
