"use client";

import React, { useState, Suspense } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Copy, PlusCircle, CheckCircle2, AlertCircle } from "lucide-react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // If expired token passed redirect
  React.useEffect(() => {
    if (searchParams.get("expired")) {
      toast.error("Session expired", { description: "Please log in again." });
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetchApi<{ access_token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response && response.access_token) {
        toast.success("Login successful", { description: "Authenticating..." });
        // The user object sent back by auth is basic for now - the application just decodes or stores a mocked sub-object
        // Real implementations might have a /users/me endpoint, but for now we store the context we have.
        // As per guide, the API response is just access_token. We infer username.
        login(response.access_token, { _id: "local_id", username });
      }
    } catch (error: any) {
      toast.error("Authentication Error", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm border-white/10 bg-black/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-display font-bold">Access Terminal</CardTitle>
          <CardDescription>Enter credentials to access Luminous Guardian</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Don't have clearance?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Request Access
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center items-center">Loading interface...</div>}>
      <LoginForm />
    </Suspense>
  )
}
