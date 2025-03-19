"use client";

import { useSession } from "~/lib/auth/auth-client";

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Account Settings</h1>
      {session && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Username</h2>
            <p className="text-muted-foreground">{session.user.name}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      )}
    </main>
  );
} 