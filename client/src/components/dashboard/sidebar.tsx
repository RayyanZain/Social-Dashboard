import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { BarChart3, Instagram, Linkedin, Tags, User } from "lucide-react";

const navigation = [
  {
    name: "Dashboard Overview",
    href: "/",
    icon: BarChart3,
    testId: "nav-dashboard",
  },
  {
    name: "Instagram/TikTok",
    href: "/instagram-tiktok",
    icon: Instagram,
    testId: "nav-instagram-tiktok",
  },
  {
    name: "LinkedIn/Twitter",
    href: "/linkedin-twitter",
    icon: Linkedin,
    testId: "nav-linkedin-twitter",
  },
  {
    name: "Brands",
    href: "/brands",
    icon: Tags,
    testId: "nav-brands",
  },
];

export default function DashboardSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-foreground" data-testid="sidebar-title">
            Social Dashboard
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-3 py-6">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "w-full justify-start px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  data-testid={item.testId}
                >
                  <Link href={item.href}>
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-sidebar-foreground" data-testid="user-name">
              Admin User
            </p>
            <p className="text-xs text-muted-foreground" data-testid="user-email">
              admin@company.com
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
