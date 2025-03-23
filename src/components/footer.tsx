"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="w-full border-t py-4">
      <div className="container mx-auto flex items-center justify-center space-x-6">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CodeBrief
        </div>
        
        <Separator orientation="vertical" className="h-5" />
        
        <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">Contact</span>
        
        <Separator orientation="vertical" className="h-5" />
        
        <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">Feedback</span>
        
        <Separator orientation="vertical" className="h-5" />
        
        <Link 
          href="https://github.com/EzraApple"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </Link>
        
        <Link 
          href="https://www.linkedin.com/in/ezraapple/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </Link>
      </div>
    </footer>
  );
} 