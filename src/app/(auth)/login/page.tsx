"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

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

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mock validation
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5070/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials or server error.");
      }

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        router.push("/");
      } else {
        throw new Error("No access token returned.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent overflow-visible">
      <CardHeader className="space-y-1 text-center pb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center ghost-border">
            <Lock className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-display font-bold tracking-tight text-foreground">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground font-sans">
          Enter your credentials to access the sentinel
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
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
                  className="pl-10 h-11 bg-surface-container-lowest/50 border-border/10 focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Access Key</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot key?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  className="pl-10 pr-10 h-11 bg-surface-container-lowest/50 border-border/10 focus-visible:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-xs text-destructive font-medium mt-1">
                {error}
              </p>
            )}
            <Button 
              type="submit"
              className={cn("w-full h-11 text-base font-semibold rounded-xl text-white btn-luminous border-none shadow-lg shadow-primary/20 hover:opacity-90 transition-all")}
              disabled={isLoading}
            >
              {isLoading ? "Authorizing..." : "Initiate Login"}
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="h-11 border-border/10 bg-surface-container-lowest/50 hover:bg-surface-container-high hover:border-primary/20 transition-all rounded-xl"
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Google Cloud Auth
        </Button>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground border-none bg-transparent pt-0 pb-6">
        Don&apos;t have an account?
        <Link
          href="/register"
          className="text-primary hover:underline font-semibold transition-colors"
        >
          Create tactical ID
        </Link>
      </CardFooter>
    </Card>
  );
}
