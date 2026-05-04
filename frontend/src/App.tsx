import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./lib/theme-provider";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Portfolio from "@/pages/Portfolio";
import Contact from "@/pages/Contact";
import Subscribe from "@/pages/Subscribe";
import CategoryPage from "@/pages/CategoryPage";
import TagPage from "@/pages/TagPage";
import LoginPage from "@/components/admin/LoginPage";
import Dashboard from "@/components/admin/Dashboard";
import PostEditor from "@/components/admin/PostEditor";
import DiffReview from "@/components/admin/DiffReview";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/blog/category/:slug" component={CategoryPage} />
      <Route path="/blog/tag/:slug" component={TagPage} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/contact" component={Contact} />
      <Route path="/subscribe" component={Subscribe} />

      {/* Admin routes */}
      <Route path="/admin" component={LoginPage} />
      <Route path="/admin/posts">
        {() => (
          <AdminLayout>
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/posts/new">
        {() => (
          <AdminLayout>
            <AuthGuard>
              <PostEditor />
            </AuthGuard>
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/posts/:id">
        {(params) => (
          <AdminLayout>
            <AuthGuard>
              <PostEditor id={params.id} />
            </AuthGuard>
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/posts/:id/diff">
        {(params) => (
          <AdminLayout>
            <AuthGuard>
              <DiffReview id={params.id} />
            </AuthGuard>
          </AdminLayout>
        )}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
