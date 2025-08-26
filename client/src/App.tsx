import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import InstagramTiktok from "@/pages/instagram-tiktok";
import LinkedinTwitter from "@/pages/linkedin-twitter";
import Brands from "@/pages/brands";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/instagram-tiktok" component={InstagramTiktok} />
      <Route path="/linkedin-twitter" component={LinkedinTwitter} />
      <Route path="/brands" component={Brands} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar />
            <main className="flex-1">
              <Toaster />
              <Router />
            </main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
