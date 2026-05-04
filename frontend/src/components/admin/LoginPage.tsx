import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/api-client";

export default function LoginPage() {
  const { login, setDeepseek } = useAuth();
  const [, navigate] = useLocation();
  const [key, setKey] = useState("");
  const [deepseekKey, setDeepseekKeyState] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Verify the key works by hitting an admin endpoint
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/admin/posts`,
        { headers: { "X-API-Key": key } }
      );

      if (!res.ok) {
        throw new Error("Invalid API key");
      }

      login(key);
      if (deepseekKey.trim()) {
        setDeepseek(deepseekKey.trim());
      }
      navigate("/admin/posts");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your admin API key to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Admin API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deepseekKey">DeepSeek API Key (optional)</Label>
              <Input
                id="deepseekKey"
                type="password"
                placeholder="Enter your DeepSeek key for AI editing"
                value={deepseekKey}
                onChange={(e) => setDeepseekKeyState(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Enter Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
