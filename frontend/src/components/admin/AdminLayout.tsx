import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, Plus } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1
              className="font-bold text-lg cursor-pointer"
              onClick={() => navigate("/admin/posts")}
            >
              Blog Admin
            </h1>
            <nav className="hidden sm:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/posts")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Posts
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/posts/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { logout(); navigate("/"); }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
