"use client";

import Link from "next/link"
import { useRouter } from "next/navigation";
import { User, Home } from "lucide-react"
import { useSession, signOut } from "~/lib/auth/auth-client";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {getSession} from "better-auth/api";

export function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className="w-full border-b">
      <div className="flex h-16 items-center container mx-auto">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="text-xl font-bold">
            CodeBrief
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/guide" className="text-sm font-medium transition-colors hover:text-primary">
              Guide
            </Link>
            
            <Separator orientation="vertical" className="h-6" />
            
            {session && (
              <Link 
                href="/dashboard" 
                className="hover:text-primary transition-colors"
                aria-label="Dashboard"
              >
                <Home className="h-5 w-5" />
              </Link>
            )}
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <p className="px-2 py-1.5 text-sm font-medium">
                    {session.user.name}
                  </p>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      router.push("/");
                    }}
                    className="text-red-600 cursor-pointer"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 