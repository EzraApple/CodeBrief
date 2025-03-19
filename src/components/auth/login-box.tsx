"use client";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

export function LoginBox( { repoUrl }: { repoUrl: string | null } ) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="mt-4">
            <SignInForm repoUrl={repoUrl} />
          </TabsContent>
          <TabsContent value="sign-up" className="mt-4">
            <SignUpForm repoUrl={repoUrl} />
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
} 