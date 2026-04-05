"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password || !confirmPassword) {
      setError("Strategic error: All fields are mandatory.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Strategic error: Access keys do not match.");
      setIsLoading(false);
      return;
    }

    // Mock registration delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1500);
  }

  return (
    <Card className="border-none shadow-none bg-transparent overflow-visible">
      <CardHeader className="space-y-1 text-center pb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center ghost-border">
            <ShieldCheck className="w-6 h-6 text-secondary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-display font-bold tracking-tight text-foreground">
          New Tactical ID
        </CardTitle>
        <CardDescription className="text-muted-foreground font-sans">
          Register your credentials to the network
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Agent Codename</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Nova_Sentinel"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="pl-10 h-11 bg-surface-container-lowest/50 border-border/10 focus-visible:ring-secondary/20"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Intelligence ID (Email)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  placeholder="name@agency.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="pl-10 h-11 bg-surface-container-lowest/50 border-border/10 focus-visible:ring-secondary/20"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Access Key</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  className="pl-10 h-11 bg-surface-container-lowest/50 border-border/10 focus-visible:ring-secondary/20"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Access Key</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  disabled={isLoading}
                  className="pl-10 h-11 bg-surface-container-lowest/50 border-border/10 focus-visible:ring-secondary/20"
                />
              </div>
            </div>
            {error && (
              <p className="text-xs text-destructive font-medium mt-1">
                {error}
              </p>
            )}
            <Button 
              className={cn("w-full h-11 text-base font-semibold rounded-xl text-white bg-secondary hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 border-none mt-2")}
              disabled={isLoading}
            >
              {isLoading ? "Provisioning..." : "Create Identity"}
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Security Protocol
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          By registering, you agree to our 
          <Link href="/terms" className="text-primary hover:underline mx-1">Field Guidelines</Link> 
          and 
          <Link href="/privacy" className="text-primary hover:underline mx-1">Data Sovereignty</Link>.
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground border-none bg-transparent pt-0 pb-6">
        Already have a Tactical ID?
        <Link
          href="/login"
          className="text-primary hover:underline font-semibold transition-colors"
        >
          Initiate Protocol
        </Link>
      </CardFooter>
    </Card>
  );
}
