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
    </Card>
  );
} 