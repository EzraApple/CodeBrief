"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { cn } from "~/lib/shadcn/utils";
import { Loader2, Github } from "lucide-react";

import { signIn } from "~/lib/auth/auth-client";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function SignInForm({ repoUrl }: { repoUrl: string | null }) {
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await signIn.email(values);
      console.log(result)
      
      if (result.error) {
        throw result.error;
      }

      router.push(
        repoUrl
          ? `/dashboard/new?repoUrl=${encodeURIComponent(repoUrl)}`
          : "/dashboard"
      );
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      form.setError("root", {
        message: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGithubSignIn() {
    setIsGithubLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: repoUrl
          ? `/dashboard/new?repoUrl=${encodeURIComponent(repoUrl)}`
          : "/dashboard",
      });
    } catch (error) {
      console.error("GitHub sign in error:", error);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsGithubLoading(false);
    }
  }

  return (
    <div className={cn("space-y-6", shake && "animate-shake")}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="flex items-center space-x-2">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full" 
        onClick={handleGithubSignIn}
        disabled={isGithubLoading}
      >
        {isGithubLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In with GitHub
          </>
        ) : (
          <>
            <Github className="mr-2 h-4 w-4" />
            Sign In with GitHub
          </>
        )}
      </Button>
    </div>
  );
} 