"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { cn } from "~/lib/shadcn/utils";
import { Loader2, Github } from "lucide-react";

import { signUp, signIn } from "~/lib/auth/auth-client";
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
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
});

export function SignUpForm({ repoUrl }: { repoUrl: string | null }) {
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  console.log("Form state:", {
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.username,
      });

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
        message: "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGithubSignUp() {
    setIsGithubLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: repoUrl
          ? `/dashboard/new?repoUrl=${encodeURIComponent(repoUrl)}`
          : "/dashboard",
      });
    } catch (error) {
      console.error("GitHub sign up error:", error);
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
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
                Creating Account
              </>
            ) : (
              "Create Account"
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
        onClick={handleGithubSignUp}
        disabled={isGithubLoading}
      >
        {isGithubLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing Up with GitHub
          </>
        ) : (
          <>
            <Github className="mr-2 h-4 w-4" />
            Sign Up with GitHub
          </>
        )}
      </Button>
    </div>
  );
} 