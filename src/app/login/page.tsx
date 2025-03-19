"use client";

import { Separator } from "~/components/ui/separator";
import { LoginBox } from "~/components/auth/login-box";

export default function LoginPage() {
  return (
    <main className="container mx-auto flex h-[calc(100vh-4rem)]">
      {/* Left side - Login */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <LoginBox />
      </div>

      <Separator orientation="vertical" />

      {/* Right side - Placeholder */}
      <div className="flex flex-1 flex-col items-center justify-start p-8">
        <div className="w-full max-w-sm">
          <h1 className="mb-8 text-3xl font-semibold">
            Placeholder
          </h1>
          {/* Future content will go here */}
        </div>
      </div>
    </main>
  );
} 