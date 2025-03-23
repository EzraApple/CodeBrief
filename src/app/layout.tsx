import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { NavBar } from "~/components/navigation/nav-bar";
import { Footer } from "~/components/footer";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "CodeBrief",
  description: "Explain new codebases instantly",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen bg-background flex flex-col">
        <TRPCReactProvider>
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
